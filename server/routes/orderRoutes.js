const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

//TODO: add jwt verification

router.get("/:id", orderController.getOrder);

module.exports = router;
