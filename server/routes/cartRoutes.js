const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router
	.post("/:id", cartController.createACart)
	.get("/:id", cartController.getACart);
// .put(cartController.updateACart)
// .delete(cartController.deleteACart);

module.exports = router;
