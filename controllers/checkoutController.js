const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");
const { response } = require("express");
const Order = require("../models/Order");

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const fulfillOrder = async (session) => {
	const productsData = session.line_items.data.map((item, idx) => {
		return {
			productId: JSON.parse(session.metadata.productId)[idx],
			img: JSON.parse(session.metadata.images)[idx],
			title: item.description,
			quantity: item.quantity,
			price: item.amount_subtotal,
			size: JSON.parse(session.metadata.sizes)[idx],
			color: JSON.parse(session.metadata.colors)[idx],
		};
	});
	const newOrder = await Order.create({
		userId: session.metadata.userId,
		totalPrice: session.amount_total,
		delivered: "DELIVERED",
		products: productsData,
		allImages: JSON.parse(session.metadata.images),
	});

	// const userCart = Cart.findOne({ userId });
	// if (userCart) {
	// 	const result = await userCart.delete();
	// }
};

const checkoutSession = asyncHandler(async (req, res) => {
	const userId = req.params.id;
	const cart = await Cart.findOne({ userId }).exec();

	if (cart) {
		const transformedItems = cart.products.map((item) => {
			return {
				quantity: item.quantity,
				adjustable_quantity: { enabled: true },
				price_data: {
					currency: "usd",
					unit_amount: item.price,
					product_data: {
						name: item.title,
						images: [item.img],
						metadata: {
							color: item.color,
							size: item.size,
						},
					},
				},
			};
		});

		const session = await stripe.checkout.sessions.create({
			line_items: transformedItems,
			automatic_tax: {
				enabled: true,
			},

			shipping_address_collection: {
				allowed_countries: ["US", "CA"],
			},
			mode: "payment",
			payment_method_types: ["card"],
			success_url: `${process.env.SITE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.SITE_URL}/cart`,
			metadata: {
				images: JSON.stringify(cart.products.map((item) => item.img)),
				colors: JSON.stringify(cart.products.map((item) => item.color)),
				sizes: JSON.stringify(cart.products.map((item) => item.size)),
				productId: JSON.stringify(cart.products.map((item) => item.productId)),
				userId,
			},
		});
		res.send({ url: session.url });
	}
});

const checkoutSuccess = asyncHandler(async (req, res) => {
	const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
	const customer = await stripe.customers.retrieve(session.customer);
	res.status(200).json({ customer });
});

const checkoutWebhook = asyncHandler(async (req, res) => {
	const payload = req.body;
	const sig = req.headers["stripe-signature"];
	let event;

	try {
		event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
	} catch (err) {
		return response.status(400).send(`Webhook Error: ${err.message}`);
	}

	// Handle the checkout.session.completed event
	if (event.type === "checkout.session.completed") {
		const session = event.data.object;
		const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
			session.id,
			{
				expand: ["line_items"],
			}
		);
		// Fulfill the purchase to save order in DB...
		fulfillOrder(sessionWithLineItems);
	}

	res.status(200).end();
});

module.exports = {
	checkoutSession,
	checkoutSuccess,
	checkoutWebhook,
};
