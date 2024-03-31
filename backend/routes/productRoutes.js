const express = require("express");
const router = express.Router();
const {
	getProducts,
	getProductsById,
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/productController.js");

const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin.js");

router
	.route("/")
	.get(isAuth, getProducts)
	.post(isAuth, isAdmin, createProduct);
router
	.route("/:id")
	.get(getProductsById)
	.put(isAuth, isAdmin, updateProduct)
	.delete(isAuth, isAdmin, deleteProduct);

module.exports = router;
