const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verifyJWT = require("../middleware/verifyJWT");

router
	.route("/:id")
	.post(verifyJWT, cartController.createACart)
	.get(verifyJWT, cartController.getACart)
	.put(verifyJWT, cartController.updateACart)
	.delete(verifyJWT, cartController.deleteACart);

module.exports = router;
