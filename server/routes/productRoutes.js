const express = require("express");
const router = express.Router();
const prdouctsController = require("../controllers/productsController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

router
	.route("/")
	.get(prdouctsController.getAllProducts)
	.post(verifyJWT, prdouctsController.createNewProduct);

router.put("/:id", verifyJWT, prdouctsController.updateProduct);
router.delete("/:id", verifyJWT, prdouctsController.deleteProduct);
module.exports = router;
