const express = require("express");
const router = express.Router();
const {
	addOrderItems,
	getMyOrders,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getOrders,
} = require("../controllers/orderController.js");

const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin.js");

router
	.route("/")
	.post(isAuth, addOrderItems)
	.get(isAuth, isAdmin, getOrders);
router.route("/mine").get(isAuth, getMyOrders);
router.route("/:id").get(isAuth, getOrderById);
router.route("/:id/pay").put(isAuth, updateOrderToPaid);
router
	.route("/:id/deliver")
	.put(isAuth, isAdmin, updateOrderToDelivered);

module.exports = router;
