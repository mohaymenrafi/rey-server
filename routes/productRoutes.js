const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const verifyJWT = require("../middleware/verifyJWT");

router
	.route("/")
	.get(productsController.getAllProducts)
	.post(verifyJWT, productsController.createNewProduct);
router.put("/:id", verifyJWT, productsController.updateProduct);
router.delete("/:id", verifyJWT, productsController.deleteProduct);
router.get("/toppicks", productsController.getTopPicks);
router.get("/:id", productsController.singleProduct);

module.exports = router;
