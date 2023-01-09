const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}
	const foundUser = await User.findOne({ username }).lean().exec();
	if (!foundUser || !foundUser.active) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	// console.log({ foundUser });
	const matchUser = await bcrypt.compare(password, foundUser.password);
	if (!matchUser) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const accessToken = jwt.sign(
		{
			UserInfo: {
				username: foundUser.username,
				roles: foundUser.roles,
			},
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "2m" }
	);

	const refreshToken = jwt.sign(
		{ username: foundUser.username },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: "2h" }
	);

	//create secure cookie with refresh token
	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		sameSite: "None",
		secure: true,
		maxAge: 7 * 24 * 60 * 60 * 1000, // expires in 7 days
	});
	const user = {
		username: foundUser.username,
		firstname: foundUser.firstname,
		lastname: foundUser.lastname,
		email: foundUser.email,
		id: foundUser._id,
		roles: foundUser.roles,
		active: foundUser.active,
		accessToken,
		refreshToken,
	};

	//send accessToken containing username and roles
	res.status(200).send(user);
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
	const refreshToken = cookies.jwt;
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		asyncHandler(async (err, decode) => {
			if (err) return res.status(403).json({ message: "Forbidden" });
			const foundUser = await User.findOne({ username: decode.username });
			if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: foundUser.username,
						roles: foundUser.roles,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "2m" }
			);
			res.status(200).json({ accessToken });
		})
	);
});

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //no content
	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.json({ message: "Cookie cleared" });
});

module.exports = {
	login,
	refresh,
	logout,
};
