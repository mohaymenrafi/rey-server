const express = require("express");
const router = express.Router();
const prdouctsController = require("../controllers/productsController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);
//.post(verifyJWT, prdouctsController.createNewProduct);
router
	.route("/")
	.get(verifyJWT, prdouctsController.getAllProducts)
	.post(verifyJWT, prdouctsController.createNewProduct);

router.put("/:id", prdouctsController.updateProduct);
router.delete("/:id", prdouctsController.deleteProduct);
module.exports = router;
