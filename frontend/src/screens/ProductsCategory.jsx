import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import openSocket from "socket.io-client";
import { Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import { useParams } from "react-router-dom";
// MUI
import { Box } from "@mui/material";
import { FaLongArrowAltUp } from "react-icons/fa";
// Styling
import "../components/css/board.css";
import {
	adAreaStyle,
	boardStyle,
} from "../components/css/boardStyle";
// Actions
import {
	loadAds,
	adPostedByOther,
	updateAdInList,
} from "../actions/ad";
import { setAlert, clearAlerts } from "../actions/alert";
// Components
import Spinner from "../components/Spinner";
import AuctionItem from "../components/AuctionItem";

const ProductsCategory = (props) => {
	const { category: category } = useParams();
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
			socket.on("addAd", (data) => {
				if (
					props.user &&
					data.ad.owner &&
					data.ad.owner.toString() !== props.user._id.toString()
				) {
					props.clearAlerts();
					props.setAlert("New ads available", "info", 60000);
				}
			});
			socket.on("auctionStarted", (res) => {
				props.updateAdInList(res.data);
			});
			socket.on("auctionEnded", (res) => {
				props.updateAdInList(res.data);
			});

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
			for (const productCategory in categoryObj) {
				if (category == productCategory) {
					productsArr.push({
						category: productCategory,
						products: categoryObj[category],
					});
				}
			}
			setAllProducts(productsArr[0]);
			if (category == "auction") {
				setAllProducts({
					category: "Live Auctions",
					products: props.ads,
				});
			}
		}
	}, [products, props.ads]);

	const ascendingSortQuick = (arr) => {
		if (arr.length <= 1) {
			return arr;
		}

		let pivot = +arr[0].currentPrice?.$numberDecimal || arr[0].price;
		let leftArr = [];
		let rightArr = [];

		for (let i = 1; i < arr.length; i++) {
			const price =
				+arr[i].currentPrice?.$numberDecimal || arr[i].price;
			if (price < pivot) {
				leftArr.push(arr[i]);
			} else {
				rightArr.push(arr[i]);
			}
		}

		return [
			...ascendingSortQuick(leftArr),
			arr[0],
			...ascendingSortQuick(rightArr),
		];
	};

	const descendingSortMerge = (arr) => {
		if (arr.length <= 1) {
			return arr;
		}

		const mid = Math.floor(arr.length / 2);
		const leftArr = arr.slice(0, mid);
		const rightArr = arr.slice(mid);

		const sortedLeft = descendingSortMerge(leftArr);
		const sortedRight = descendingSortMerge(rightArr);

		return merge(sortedLeft, sortedRight);
	};

	function merge(left, right) {
		let result = [];
		let leftIndex = 0;
		let rightIndex = 0;

		while (leftIndex < left.length && rightIndex < right.length) {
			const leftPrice =
				+left[leftIndex].currentPrice?.$numberDecimal ||
				left[leftIndex].price;
			const rightPrice =
				+right[rightIndex].currentPrice?.$numberDecimal ||
				right[rightIndex].price;

			if (leftPrice > rightPrice) {
				result.push(left[leftIndex]);
				leftIndex++;
			} else {
				result.push(right[rightIndex]);
				rightIndex++;
			}
		}

		while (leftIndex < left.length) {
			result.push(left[leftIndex]);
			leftIndex++;
		}
		while (rightIndex < right.length) {
			result.push(right[rightIndex]);
			rightIndex++;
		}

		return result;
	}

	const sortChanged = (event) => {
		const sortingCondition = event.target.value;
		if (sortingCondition != "") {
			let sortedArr = [];
			if (sortingCondition == "ascending") {
				sortedArr = ascendingSortQuick(allProducts.products);
			} else {
				sortedArr = descendingSortMerge(allProducts.products);
			}
			setAllProducts((prev) => {
				return {
					...prev,
					products: sortedArr,
				};
			});
		}
	};
	return props.loading ? (
		<Spinner />
	) : (
		<Box sx={boardStyle}>
			<div>
				{allProducts && allProducts.products?.length > 0 && (
					<div
						style={{
							padding: "30px 30px",
							margin: "0 auto",
							width: "max-content",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
								maxWidth: "1346px",
							}}
						>
							<h4 style={{ color: "black" }}>
								{allProducts.category} Products
							</h4>
							<select
								style={{ padding: "0 10px", cursor: "pointer" }}
								onChange={sortChanged}
								defaultValue=""
							>
								<option value="" disabled>
									Sort By
								</option>
								<option value="ascending">Price Low To High</option>
								<option value="descending">Price High To Low</option>
							</select>
						</div>
						<Box
							sx={adAreaStyle}
							style={{ marginTop: "20px", width: "max-content" }}
						>
							{allProducts.products &&
								allProducts.products.length > 0 &&
								allProducts.products.map((product, index) => {
									if (product.room) {
										return <AuctionItem ad={product} key={index} />;
									} else {
										return (
											<Col key={index} sm={12} md={6} lg={4} xl={3}>
												<Product product={product} />
											</Col>
										);
									}
								})}
						</Box>
					</div>
				)}
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
})(ProductsCategory);
