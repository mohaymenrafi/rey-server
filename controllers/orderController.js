const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");

// @desc get all Orders
// @route GET /api/orders
// @access private
const getOrder = asyncHandler(async (req, res) => {
	const userId = req.params.id;
	if (!userId) {
		return res.send({ message: "Invalid user ID" });
	}
	const orders = await Order.find({ userId }).lean().exec();
	if (orders.length) {
		return res.status(200).json(orders);
	}
	res.status(400).json({ message: "No orders found for this user" });
});

module.exports = {
	getOrder,
};
