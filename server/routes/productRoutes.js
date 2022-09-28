const express = require("express");
const router = express.Router();
const prdouctsController = require("../controllers/productsController");

router
	.route("/")
	.get(prdouctsController.getAllProducts)
	.post(prdouctsController.createNewProduct);

router.put("/:id", prdouctsController.updateProduct);
router.delete("/:id", prdouctsController.deleteProduct);
module.exports = router;
