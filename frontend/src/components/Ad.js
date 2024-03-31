import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import openSocket from "socket.io-client";
// Actions
import {
	loadAdDetails,
	loadAdImage,
	loadHighestBid,
	placeBid,
	startAuction,
	updateTimer,
	updateAdDetails,
	clearAdImage,
	setImageLoadingStatus,
	clearAdDetails,
} from "../actions/ad.js";
import {
	PayPalButtons,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useGetPaypalClientIdQuery } from "../slices/ordersApiSlice.js";
import { setAlert, clearAlerts } from "../actions/alert.js";
import axios from "axios";
// MUI Components
import {
	Paper,
	Box,
	Typography,
	Divider,
	TextField,
	Button,
} from "@mui/material";
// Project components
import Alert from "./Alert.js";
import Spinner from "./Spinner.js";
import LoadingDisplay from "./LoadingDisplay.js";

import {
	boxStyle,
	adArea,
	imageStyle,
	paperStyle,
	descriptionArea,
	imageContainer,
	bidContainer,
	bidButtonStyle,
} from "./css/adStyles.js";
import { secondsToHms } from "../utils/secondsToHms.js";

const Ad = (props) => {
	const params = useParams();
	const [bidPrice, setBidPrice] = useState(0);
	const [bidButton, setBidButton] = useState(true);
	const [ownerAd, setOwnerAd] = useState(false);
	const [startButton, setStartButton] = useState(true);
	const navigate = useNavigate();
	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
	const [showPaypal, setShowPaypal] = useState(false);

	const {
		data: paypal,
		isLoading: loadingPayPal,
		error: errorPayPal,
	} = useGetPaypalClientIdQuery();
	useEffect(() => {
		if (!errorPayPal && !loadingPayPal && paypal.clientId) {
			const loadPaypalScript = async () => {
				paypalDispatch({
					type: "resetOptions",
					value: {
						"client-id": paypal.clientId,
						currency: "USD",
					},
				});
				paypalDispatch({
					type: "setLoadingStatus",
					value: "pending",
				});
			};

			loadPaypalScript();
		}
	}, [errorPayPal, loadingPayPal, paypal, paypalDispatch]);

	// Bid button status
	const updateBidButtonStatus = (updatedPrice) => {
		if (
			updatedPrice >
				Number(props.adDetails.currentPrice.$numberDecimal) &&
			props.adDetails.auctionStarted &&
			!props.adDetails.auctionEnded
		) {
			setBidButton(false);
		} else {
			setBidButton(true);
		}
	};

	useEffect(() => {
		props.clearAlerts();
		props.setImageLoadingStatus();
		props.loadAdDetails(params.adId);
	}, [params.adId]);
	const [image, setImage] = useState("");
	useEffect(() => {
		if (props.adDetails.image) {
			setImage(props.adDetails.image);
			console.log(props.adDetails.image);
		}
	}, [props.adDetails.image]);

	useEffect(() => {
		props.loadHighestBid(params.adId);
	}, [params.adId]);

	useEffect(() => {
		updateBidButtonStatus(bidPrice);
	}, [bidPrice, props.adDetails.auctionEnded]);

	// For ad rooms
	useEffect(() => {
		const adSocket = openSocket(process.env.REACT_APP_API_BASE_URL, {
			path: "/socket/adpage",
		});
		// User enters add page
		adSocket.emit("joinAd", { ad: params.adId.toString() });
		// Auction is started
		adSocket.on("auctionStarted", (res) => {
			console.log(res);
			props.updateAdDetails(res.data);
			props.clearAlerts();
			if (res.action === "started")
				props.setAlert("Auction started!", "info");
		});
		// Auction is ended
		adSocket.on("auctionEnded", (res) => {
			if (res.action === "sold") {
				props.updateAdDetails(res.ad);
				props.clearAlerts();
				props.setAlert(
					`Auction ended, item sold to ${res.winner.username}!`,
					"info"
				);
			} else {
				props.updateAdDetails(res.data);
				props.clearAlerts();
				props.setAlert("Item not sold", "info");
			}
		});
		// Timer
		adSocket.on("timer", (res) => {
			props.updateTimer(res.data);
		});
		// Bid is posted
		adSocket.on("bidPosted", (res) => {
			console.log("bidposted");
			props.loadHighestBid(res.data._id);
			props.updateAdDetails(res.data);
		});

		return () => {
			adSocket.emit("leaveAd", { ad: params.adId.toString() });
			adSocket.off();
			props.clearAdDetails();
			props.clearAdImage();
		};
		// setAdSocketState(adSocket);
	}, [params.adId]);

	// Check if current user is the owner of ad
	useEffect(() => {
		if (props.adDetails.owner && props.auth.user) {
			if (props.adDetails.owner._id === props.auth.user._id)
				setOwnerAd(true);
			else setOwnerAd(false);
		}
		// Check start button
		if (
			!props.adDetails.auctionStarted &&
			!props.adDetails.auctionEnded
		) {
			setStartButton(true);
		} else {
			setStartButton(false);
		}
	}, [
		props.adDetails.owner,
		props.auth.user,
		props.adDetails.auctionStarted,
		props.adDetails.auctionEnded,
	]);

	if (props.authLoading) {
		return <Spinner />;
	}

	// Check if user is logged
	if (!props.isAuth) {
		navigate("/login");
	}

	if (props.loading || props.loadingHighestBid) {
		console.log("loading");
		return <Spinner />;
	}

	const handleBidPriceChange = (e) => {
		setBidPrice(e.target.value);
	};

	const showPayment = () => {
		setShowPaypal(true);
	};

	async function createOrder(data, actions) {
		const rate = await axios.get(
			"https://v6.exchangerate-api.com/v6/11367df60cdc66f335dcf1d4/latest/NPR"
		);
		const amount = (
			rate.data.conversion_rates.USD * bidPrice
		).toFixed(2);
		return actions.order
			.create({
				purchase_units: [
					{
						amount: { value: amount },
					},
				],
			})
			.then((orderID) => {
				return orderID;
			});
	}
	const handleSubmitBid = (e) => {
		// Place bid
		props.placeBid(props.adDetails._id, bidPrice);
		setShowPaypal(false);
	};

	const handleStartAuction = (e) => {
		e.preventDefault();
		props.startAuction(props.adDetails._id);
		props.setAlert("Auction started", "success");
	};

	const getTimeRemaining = () => {
		return secondsToHms(props.adDetails.timer);
	};

	const getUTCDate = (dt) => {
		let isodt = new Date(dt);
		return isodt.toDateString();
	};

	// Auction status based on the ad-details
	const auctionStatus = () => {
		if (props.adDetails.sold) {
			return "Sold";
		} else if (props.adDetails.auctionEnded) {
			return "Ended, not-sold";
		} else if (!props.adDetails.auctionStarted) {
			return "Upcoming";
		} else {
			return "Ongoing";
		}
	};

	return (
		<div className="ad__page">
			{props.loading ? (
				<LoadingDisplay />
			) : (
				<Fragment>
					<Alert />
					{!props.adDetails.owner ? (
						<LoadingDisplay />
					) : (
						<Box sx={boxStyle}>
							<Paper sx={paperStyle}>
								<Typography variant="h4">
									{props.adDetails.productName}
								</Typography>
								<Box sx={adArea}>
									<Box sx={imageContainer}>
										<img
											src={image}
											alt={props.adDetails.productName}
											style={imageStyle}
										/>
									</Box>
									<Box sx={descriptionArea}>
										<Typography variant="h6">Description</Typography>
										<Typography variant="body2">
											{props.adDetails.description}
										</Typography>
										<Divider
											variant="middle"
											sx={{ margin: ".5rem" }}
										/>

										<Typography variant="h6">Info</Typography>
										<Typography variant="body1">
											Posted on:{" "}
											{getUTCDate(props.adDetails.createdAt)}
										</Typography>
										<Typography variant="body1">
											Seller: {props.adDetails.owner.username}
										</Typography>
										<Typography variant="body1">
											Base price:{" "}
											{props.adDetails.basePrice.$numberDecimal}
										</Typography>
										<Divider
											variant="middle"
											sx={{ margin: ".5rem" }}
										/>

										<Typography variant="h6">Auction</Typography>
										<Typography variant="body1">
											Status: {auctionStatus()}
										</Typography>
										<Typography variant="body1">
											Bids: {props.adDetails.bids.length}
										</Typography>
										<Typography variant="body1">
											Time remaining: {getTimeRemaining()}
										</Typography>
										<Typography variant="body1">
											Current price: Rs.
											{props.adDetails.currentPrice.$numberDecimal}
										</Typography>
										<Typography variant="body1">
											Current bidder:{" "}
											{props.highestBid &&
												props.highestBid.user.username}
										</Typography>
										<Divider
											variant="middle"
											sx={{ margin: ".5rem" }}
										/>

										{!ownerAd && (
											<>
												<Box sx={bidContainer}>
													<TextField
														label="Rs."
														id="bid-price"
														size="small"
														onChange={(e) => {
															handleBidPriceChange(e);
														}}
													/>
													<Box sx={{ height: "auto" }}>
														<Button
															variant="contained"
															disabled={bidButton}
															onClick={showPayment}
															sx={bidButtonStyle}
														>
															Place bid
														</Button>
													</Box>
												</Box>
												{showPaypal && (
													<Box>
														<PayPalButtons
															createOrder={createOrder}
															onApprove={handleSubmitBid}
														></PayPalButtons>
													</Box>
												)}
											</>
										)}

										{ownerAd && (
											<Box sx={bidContainer}>
												<Box sx={{ height: "auto" }}>
													<Button
														variant="contained"
														disabled={!startButton}
														onClick={(e) => handleStartAuction(e)}
														sx={bidButtonStyle}
													>
														Start Auction
													</Button>
												</Box>
											</Box>
										)}
									</Box>
								</Box>
							</Paper>
						</Box>
					)}
				</Fragment>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	adDetails: state.ad.adDetails,
	loading: state.ad.loading,
	authLoading: state.auth.loading,
	isAuth: state.auth.isAuthenticated,
	alerts: state.alert,
	highestBid: state.ad.highestBid,
	loadingBid: state.ad.loadingHighestBid,
	auth: state.auth,
	adImage: state.ad.adImage,
	imageLoading: state.ad.imageLoading,
});

export default connect(mapStateToProps, {
	loadAdDetails,
	loadAdImage,
	loadHighestBid,
	placeBid,
	startAuction,
	setAlert,
	clearAlerts,
	updateTimer,
	updateAdDetails,
	clearAdImage,
	setImageLoadingStatus,
	clearAdDetails,
})(Ad);
