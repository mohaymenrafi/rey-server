const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/:id", verifyJWT, orderController.getOrder);

module.exports = router;
