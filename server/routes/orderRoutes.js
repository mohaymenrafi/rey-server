const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyJWT = require("../middleware/verifyJWT");

//TODO: add routes for order update

router.get("/:id", verifyJWT, orderController.getOrder);

module.exports = router;
