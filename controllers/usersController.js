const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /api/users
// @acess Private
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select("-password").lean();
	if (!users?.length) {
		return res.status(400).json({ message: "No users found" });
	}
	res.json(users);
});

// @desc create a new user
// @route POST /api/users
// @acess Private
const createNewUser = asyncHandler(async (req, res) => {
	const { firstname, lastname, email, username, password, roles } = req.body;

	//confirm data
	if (
		!username ||
		!password ||
		!Array.isArray(roles) ||
		!roles.length ||
		!email
	) {
		return res.status(400).json({ message: "All fields are required" });
	}
	//check for duplicates
	const duplicate = await User.findOne({ username }).exec();
	if (duplicate) {
		return res.status(409).json({ message: "Duplicate username" });
	}
	//Hash Pass
	const hashedPass = await bcrypt.hash(password, 10); // salt rounds

	const userObject = { ...req.body, password: hashedPass };

	//create a new user
	const user = await User.create(userObject);
	if (user) {
		res.status(201).json({ message: `New User ${username} created` });
	} else {
		res.status(400).json({ message: "Invalid user data received" });
	}
});

// @desc update a user
// @route PUT /api/users
// @acess Private
const updateUser = asyncHandler(async (req, res) => {
	const { id, username, roles, active, password, firstname, lastname, email } =
		req.body;

	//confirm data
	if (
		!id ||
		!username ||
		!email ||
		!Array.isArray(roles) ||
		!roles.length ||
		typeof active !== "boolean"
	) {
		return res.status(400).json({ message: "All fields are required" });
	}
	const user = await User.findById(id).lean().exec();

	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}
	//check for duplicates
	const duplicate = await User.findOne({ username }).exec();

	if (duplicate && duplicate._id.toString() !== id) {
		return res.status(409).json({ message: "Duplicate username" });
	}
	user.username = username;
	user.roles = roles;
	user.active = active;
	user.email = email;
	user.firstname = firstname;
	user.lastname = lastname;

	if (password) {
		user.password = await bcrypt.hash(password, 10);
	}

	const updatedUser = await user.save();
	res.json({ message: `${updatedUser.username} is updated` });
});

// @desc delete a user
// @route DELETE /api/users
// @acess Private
const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ message: "ID is required" });
	}
	const user = await User.findById(id).lean().exec();
	if (!user) {
		return res.status(400).json({ message: "User is not found" });
	}
	const result = await user.delete();
	const reply = `${result.username} with ID:${result._id} deleted`;
	res.json(reply);
});

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
};
