const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// @desc Get all products
// @route GET /api/products
// @access public
const getAllProducts = asyncHandler(async (req, res) => {
	let { limit = 12, page = 1, category, color, size } = req.query;

	if (typeof limit !== "number") limit = parseInt(limit);
	if (typeof page !== "number") page = parseInt(page);
	let filterConfig = {};
	if (category) {
		filterConfig.categories = category;
	}

	const products = await Product.find(filterConfig)
		.limit(limit)
		.skip((page - 1) * limit)
		.lean()
		.exec();

	const count = await Product.countDocuments(filterConfig);

	if (!products?.length) {
		return res.status(400).json({ message: "Product not found" });
	}
	res.status(200).json({
		products,
		totalPages: Math.ceil(count / limit),
		currentPage: page,
	});
});

// @desc get a single product
// @route GET /api/products/:id
// @access public
const singleProduct = asyncHandler(async (req, res) => {
	const _id = req.params.id;
	const product = await Product.findOne({ _id }).exec();
	if (!product) {
		return res.status(400).json({ message: "Product not found" });
	}

	let relatedProducts = await Product.find({
		categories: product.categories,
	})
		.lean()
		.exec();
	relatedProducts = relatedProducts.filter((item) => {
		// console.log(item._id);
		return !item._id.equals(mongoose.Types.ObjectId(_id));
	});

	res.status(200).json({ product, relatedProducts });
});

// @desc get limited products
// @route GET /api/products/toppicks
// @access public
const getTopPicks = asyncHandler(async (req, res) => {
	console.log("hitting top picks");
	const products = await Product.find().limit(4).lean();
	return products
		? res.status(200).json(products)
		: res.status(400).json({ message: "No products found" });
});

// @desc create a new product
// @route POST /api/products
// @access private
const createNewProduct = asyncHandler(async (req, res) => {
	const { title, desc, img, price } = req.body;

	//confirm data
	if (!title || !desc || !img || !price) {
		return res
			.status(400)
			.json({ message: "Title, Desc, Img & Price must be provided" });
	}
	let productObject = req.body;
	const product = await Product.create(productObject);
	if (product) {
		res.status(201).json({ message: `New Product ${product.title} created` });
	} else {
		res.status(400).json({ message: "Invalid product data received" });
	}
});

// @desc update a product
// @route PUT /api/products/:id
// @access private
const updateProduct = asyncHandler(async (req, res) => {
	const id = req.params.id;

	const updatedProduct = await Product.findByIdAndUpdate(
		id,
		{ $set: req.body },
		{ new: true }
	)
		.lean()
		.exec();
	res.status(200).send(updatedProduct);
});

// @desc update a product
// @route DELETE /api/products/:id
// @access private
const deleteProduct = asyncHandler(async (req, res) => {
	const id = req.params.id;
	const deletedProduct = await Product.findByIdAndDelete(id).lean().exec();
	res
		.status(200)
		.json({ message: `${deletedProduct.title} has been deleted ` });
});

module.exports = {
	getAllProducts,
	createNewProduct,
	updateProduct,
	deleteProduct,
	getTopPicks,
	singleProduct,
};

// const filterQueryObj = Object.fromEntries(
// 	Object.entries(queryObj).filter(([_, value]) => !!value)
// );
