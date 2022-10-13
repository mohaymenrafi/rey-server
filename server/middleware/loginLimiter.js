const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimitter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	message: {
		message:
			"Too many login attempts from this ip, please try again in a minute",
	},
	handler: (req, res, next, options) => {
		logEvents(
			`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
			"errLog.log"
		);
		res.status(options.statusCode).send(options.message);
	},
	standardHeaders: true,
	legaceyHeaders: true,
});

module.exports = loginLimitter;
