import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import openSocket from "socket.io-client";
import { Navigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Product from "./Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";

// MUI
import { Box } from "@mui/material";
// Styling
import "./css/board.css";
import { adAreaStyle, boardStyle } from "./css/boardStyle";
// Actions
import {
	loadAds,
	adPostedByOther,
	updateAdInList,
} from "../actions/ad";
import { setAlert, clearAlerts } from "../actions/alert";
// Components
import Spinner from "./Spinner";
import AuctionItem from "./AuctionItem";

const Board = (props) => {
	const [allProducts, setAllProducts] = useState([]);
	const { data: products, refetch } = useGetProductsQuery();
	let productsArr = [];
	const categoryObj = {};
	useEffect(() => {
		if (props.passedUser) {
			props.loadAds(props.passedUser);
		} else {
			props.loadAds();
			const socket = openSocket(process.env.REACT_APP_API_BASE_URL);
			// when new ad is added
			socket.on("addAd", (data) => {
				console.log(data);
				if (
					props.user &&
					data.ad.owner &&
					data.ad.owner.toString() !== props.user._id.toString()
				) {
					props.clearAlerts();
					props.setAlert("New ads available", "info", 60000);
				}
			});
			// when auction starts/ends
			socket.on("auctionStarted", (res) => {
				props.updateAdInList(res.data);
			});
			socket.on("auctionEnded", (res) => {
				props.updateAdInList(res.data);
			});

			// disconnect socket when page left
			return () => {
				socket.emit("leaveHome");
				socket.off();
				props.clearAlerts();
			};
		}
	}, []);

	useEffect(() => {
		refetch();
		if (products && props.ads) {
			const joinedArr = props.ads.concat(products);
			joinedArr.forEach((el) => {
				const category = el.category;
				if (categoryObj[category]) {
					categoryObj[category] = [...categoryObj[category], el];
				} else {
					categoryObj[category] = [el];
				}
			});
			for (const category in categoryObj) {
				productsArr.push({
					category: category,
					products: categoryObj[category],
				});
			}
			setAllProducts(productsArr);
		}
	}, [products, props.ads]);

	// Check if user is logged
	if (!props.isAuth) {
		return <Navigate to="/login" />;
	}

	return props.loading ? (
		<Spinner />
	) : (
		<Box sx={boardStyle}>
			{props.ads && props.ads.length > 0 && (
				<>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
							alignItems: "center",
						}}
					>
						<h4 style={{ color: "black", margin: "0" }}>
							Auction Products
						</h4>
						<Link
							to={`/products/auction`}
							sx={{ textDecoration: "none" }}
						>
							<button className="viewAllBtn">VIEW ALL</button>
						</Link>
					</div>
					<Box sx={adAreaStyle}>
						{props.ads.map((ad, index) => {
							if (index < 5) {
								return ad.auctionEnded ? null : (
									<AuctionItem ad={ad} key={index} />
								);
							}
						})}
					</Box>
				</>
			)}
			<div>
				{allProducts.map((categories, idx) => {
					return (
						<div key={idx}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
									alignItems: "center",
								}}
							>
								<h4 style={{ color: "black", margin: 0 }}>
									{categories.category} Products
								</h4>
								<Link
									to={`/products/${categories.category}`}
									sx={{ textDecoration: "none" }}
								>
									<button className="viewAllBtn">VIEW ALL</button>
								</Link>
							</div>
							<Box sx={adAreaStyle}>
								{categories.products.map((product, index) => {
									if (index < 5) {
										if (product.room) {
											return <AuctionItem ad={product} key={index} />;
										} else {
											return (
												<Col key={index} sm={12} md={6} lg={4} xl={3}>
													<Product product={product} />
												</Col>
											);
										}
									}
								})}
							</Box>
						</div>
					);
				})}
			</div>
		</Box>
	);
};

const mapStateToProps = (state) => ({
	ads: state.ad.ads,
	loading: state.auth.loading,
	isAuth: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(mapStateToProps, {
	loadAds,
	adPostedByOther,
	setAlert,
	updateAdInList,
	clearAlerts,
})(Board);
