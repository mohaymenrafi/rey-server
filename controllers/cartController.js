const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

// @desc Get a cart
// @route GET /api/cart/:id
// @access private
const getACart = asyncHandler(async (req, res) => {
	const userId = req.params.id;
	try {
		const cart = await Cart.findOne({ userId }).exec();
		if (cart) {
			return res.json(cart);
		} else {
			return res.json([]);
		}
	} catch (err) {
		res.status(400).json({ message: "No products in the cart" });
	}
});

// @desc Create a cart
// @route POST /api/cart/:id
// @access private
const createACart = asyncHandler(async (req, res) => {
	const { productId, title, img, quantity, price, color, size } = req.body;
	const userId = req.params.id;
	console.log(size);

	if (!productId || !quantity || !price || !title || !size || !color) {
		return res.status(422).json({ error: "Required information missing " });
	}

	const cart = await Cart.findOne({ userId }).exec();

	if (cart) {
		const itemIndex = cart.products.findIndex((product) => {
			return (
				product.productId === productId &&
				product.color === color &&
				product.size === size
			);
		});
		if (itemIndex > -1) {
			const productItem = cart.products[itemIndex];
			productItem.quantity += quantity;
			cart.products[itemIndex] = productItem;
		} else {
			cart.products.push({
				productId,
				title,
				img,
				quantity,
				price,
				color,
				size,
			});
		}
		const updatedCart = await cart.save();
		return res.status(201).json(updatedCart);
	} else {
		const newCart = await Cart.create({
			userId,
			products: [
				{
					productId,
					title,
					img,
					quantity,
					price,
					color,
					size,
				},
			],
		});
		return res.status(201).json(newCart);
	}
});

// @desc Create a cart
// @route PUT /api/cart/:id
// @access private
const updateACart = asyncHandler(async (req, res) => {
	const userId = req.params.id;
	const { productId, quantity, color, size, action } = req.body;
	//here action must contain of these 3 options: INCREMENT | DECREMENT | DELETEITEM
	const cart = await Cart.findOne({ userId }).exec();
	if (!cart) {
		return res.status(400).json({
			error: "Cart not found for this user, please add some products first",
		});
	}
	const itemIndex = cart.products.findIndex((product) => {
		return (
			product.productId === productId &&
			product.color === color &&
			product.size === size
		);
	});
	if (itemIndex === -1) {
		return res.status(400).json({ message: "Product not found in the cart" });
	}
	if (action === "INCREMENT") {
		cart.products[itemIndex].quantity += 1;
	} else if (action === "DECREMENT") {
		cart.products[itemIndex].quantity -= 1;
	} else if (action === "DELETEITEM") {
		cart.products = cart.products.filter((_, idx) => idx !== itemIndex);
	}
	const updatedCart = await cart.save();

	res.status(200).json(updatedCart);
});

// @desc Create a cart
// @route DELETE /api/cart/:id
// @access private
const deleteACart = asyncHandler(async (req, res) => {
	const userId = req.params.id;
	const cart = await Cart.findOne({ userId }).exec();
	if (cart) {
		await cart.delete();
		res.status(200).send({ message: `cart deleted successfully` });
	}
});

module.exports = {
	getACart,
	createACart,
	updateACart,
	deleteACart,
};
