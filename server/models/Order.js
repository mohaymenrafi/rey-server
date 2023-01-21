const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		totalPrice: Number,
		delivered: {
			type: String,
			enum: ["PENDING", "DELIVERED"],
			default: "PENDING",
		},
		products: [
			{
				productId: String,
				img: String,
				title: String,
				quantity: Number,
				price: Number,
				size: String,
				color: String,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
