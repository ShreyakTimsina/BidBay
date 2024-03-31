const express = require("express");
const { body } = require("express-validator");
const auctionController = require("../controllers/auction");

const router = express.Router();

const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

// @route   GET /auction/start/:adId
// @desc    Start auction
// @access  protected
router.get(
	"/start/:adId",
	isAuth,
	isAdmin,
	auctionController.startAuction
);

// TODO:
// @route   POST /auction/end/:adId
// @desc    End auction
// @access  protected

module.exports = router;
