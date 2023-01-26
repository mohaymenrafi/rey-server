const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const bodyParser = require("body-parser");

router
	.post("/create-checkout-session/:id", checkoutController.checkoutSession)
	.get("/checkout/success", checkoutController.checkoutSuccess)
	.post(
		"/checkout/webhook",
		bodyParser.raw({ type: "*/*" }),
		checkoutController.checkoutWebhook
	);

module.exports = router;
