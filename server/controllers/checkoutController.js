const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");
const { response } = require("express");

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const fulfillOrder = (lineItems) => {
	//TODO: add to mongodb  order Database

	console.log("Fulfilling order", lineItems);
};

const checkoutSession = asyncHandler(async (req, res) => {
	const userId = req.params.id;
	const cart = await Cart.findOne({ userId });

	if (cart) {
		const transformedItems = cart.products.map((item) => {
			//TODO: ADD TAX SUPPORT HERE. O/W REMOVE FROM THE FRONTEND. HERE TAX IS NOT CALCULATED.
			return {
				quantity: item.quantity,
				price_data: {
					currency: "usd",
					unit_amount: item.price,
					tax_behavior: "inclusive",
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
			mode: "payment",
			payment_method_types: ["card"],
			success_url: `${process.env.SITE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.SITE_URL}/cart`,
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
	// const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
	// console.log(session);
	let event;

	try {
		event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
	} catch (err) {
		return response.status(400).send(`Webhook Error: ${err.message}`);
	}

	// Handle the checkout.session.completed event
	if (event.type === "checkout.session.completed") {
		// console.log(event.data);
		// console.log({ event });
		const session = event.data.object;
		const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
			session.id,
			{
				expand: ["line_items"],
			}
		);
		console.log({ sessionWithLineItems });
		const lineItems = sessionWithLineItems.line_items;

		// Fulfill the purchase...
		fulfillOrder(lineItems);
	}

	res.status(200).end();
});

module.exports = {
	checkoutSession,
	checkoutSuccess,
	checkoutWebhook,
};
