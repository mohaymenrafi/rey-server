const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

// @desc Get a cart
// @route GET /api/cart/:id
// @access private
const getACart = asyncHandler(async (req, res) => {
	const userId = req.params.id;
	const cart = await Cart.findOne({ userId });
	console.log(cart);
	if (cart) {
		return res.json(cart);
	}
	res.status(400).json({ message: "No products in the cart" });
});

// @desc Create a cart
// @route POST /api/cart/:id
// @access private
const createACart = asyncHandler(async (req, res) => {
	const { productId, quantity, title, price, color, size } = req.body;
	const userId = req.params.id;

	const cart = await Cart.findOne({ userId });
	console.log({ cart });
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
				quantity,
				title,
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
					quantity,
					title,
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
// const updateACart = asyncHandler(async () => {});

// @desc Create a cart
// @route DELETE /api/cart/:id
// @access private
// const deleteACart = asyncHandler(async () => {});

module.exports = {
	getACart,
	createACart,
};

// write api for udpate a cart and delete a cart item. also for clearing a cart.
// send userId to find the cart of the user , send proeuct id, size & color to find out the product and then update or delete it.
