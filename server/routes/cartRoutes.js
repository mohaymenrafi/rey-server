const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// TODO: Add jwt verification

router
	.route("/:id")
	.post(cartController.createACart)
	.get(cartController.getACart)
	.put(cartController.updateACart)
	.delete(cartController.deleteACart);

module.exports = router;
