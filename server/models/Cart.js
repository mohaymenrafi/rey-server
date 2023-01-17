const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		products: [
			{
				productId: String,
				quantity: Number,
				title: String,
				price: Number,
				color: String,
				size: String,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
