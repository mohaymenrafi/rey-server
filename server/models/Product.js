const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	desc: {
		type: String,
		required: true,
	},
	img: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	categories: {
		type: Array,
	},
	size: {
		type: Array,
	},
	color: {
		type: Array,
	},
	inStock: {
		type: Boolean,
	},
});

module.exports = mongoose.model("Product", productSchema);
