const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// @desc Get all products
// @route GET /api/products
// @access public
const getAllProducts = asyncHandler(async (req, res) => {
	const products = await Product.find().lean();
	if (!products?.length) {
		return res.status(400).json({ message: "Product not found" });
	}
	res.json(products);
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
	);
	res.status(200).send(updatedProduct);
});

// @desc update a product
// @route DELETE /api/products/:id
// @access private
const deleteProduct = asyncHandler(async (req, res) => {
	const id = req.params.id;
	const deletedProduct = await Product.findByIdAndDelete(id);
	res
		.status(200)
		.json({ message: `${deletedProduct.title} has been deleted ` });
});

module.exports = {
	getAllProducts,
	createNewProduct,
	updateProduct,
	deleteProduct,
};
