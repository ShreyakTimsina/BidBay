import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import openSocket from "socket.io-client";
import { connect } from "react-redux";
import { Typography } from "@mui/material";
import DashboardAdList from "../../components/DashboardAdList.js";

import {
	useGetProductsQuery,
	useDeleteProductMutation,
	useCreateProductMutation,
} from "../../slices/productsApiSlice.js";
import { toast } from "react-toastify";
import {
	loadAds,
	adPostedByOther,
	updateAdInList,
	deleteAd,
} from "../../actions/ad.js";

const ProductListScreen = (props) => {
	const { pageNumber } = useParams();

	let { data, isLoading, error, refetch } = useGetProductsQuery({
		pageNumber,
	});
	const [auctionProducts, setAuctionProducts] = useState([]);

	const [deleteProduct, { isLoading: loadingDelete }] =
		useDeleteProductMutation();

	const deleteHandler = async (id) => {
		if (window.confirm("Are you sure")) {
			try {
				await deleteProduct(id);
				refetch();
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		}
	};

	const [createProduct, { isLoading: loadingCreate }] =
		useCreateProductMutation();

	const createProductHandler = async () => {
		if (
			window.confirm("Are you sure you want to create a new product?")
		) {
			try {
				await createProduct();
				refetch();
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		}
	};
	useEffect(() => {
		if (props.passedUser) {
			props.loadAds(props.passedUser);
		} else {
			props.loadAds();
			const socket = openSocket(process.env.REACT_APP_API_BASE_URL);
			socket.on("auctionStarted", (res) => {
				props.updateAdInList(res.data);
			});
			socket.on("auctionEnded", (res) => {
				props.updateAdInList(res.data);
			});

			return () => {
				socket.emit("leaveHome");
				socket.off();
			};
		}
	}, []);
	useEffect(() => {
		setAuctionProducts(props.ads);
	}, [props.ads]);

	return (
		<div style={{ padding: "0 30px 20px 30px" }}>
			<Row className="align-items-center">
				<Col>
					<h4>Products</h4>
				</Col>
				<Col className="text-end">
					<Button className="my-3" onClick={createProductHandler}>
						<FaPlus /> Create Product
					</Button>
				</Col>
			</Row>

			{loadingCreate && <Loader />}
			{loadingDelete && <Loader />}
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error.data.message}</Message>
			) : (
				<>
					<Table
						striped
						bordered
						hover
						responsive
						className="table-sm"
					>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{data.map((product) => {
								return (
									<tr key={product._id}>
										<td>{product._id}</td>
										<td>{product.name}</td>
										<td>Rs {product.price}</td>
										<td>{product.category}</td>
										<td>
											<LinkContainer
												to={`/admin/product/${product._id}/edit`}
											>
												<Button
													variant="light"
													className="btn-sm mx-2"
												>
													<FaEdit />
												</Button>
											</LinkContainer>{" "}
											<Button
												variant="danger"
												className="btn-sm"
												onClick={() => deleteHandler(product._id)}
											>
												<FaTrash style={{ color: "white" }} />
											</Button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</>
			)}
			<div style={{ width: "100%" }}>
				<Row className="align-items-center">
					<Col>
						<h4>Auction Products</h4>
					</Col>
					<Col className="text-end">
						<Button className="my-3" onClick={() => {}}>
							<RouterLink
								to="/postad"
								color="inherit"
								style={{ textDecoration: "none" }}
							>
								<FaPlus /> Create Product
							</RouterLink>
						</Button>
					</Col>
					<Table
						striped
						bordered
						hover
						responsive
						className="table-sm"
					>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>BASE PRICE</th>
								<th>CURRENT PRICE</th>
								<th>CATEGORY</th>
								<th>DURATION</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{auctionProducts &&
								auctionProducts.length > 0 &&
								auctionProducts.map((product) => {
									return (
										<tr key={product._id}>
											<td>{product._id}</td>
											<td>{product.productName}</td>
											<td>Rs {product.basePrice.$numberDecimal}</td>
											<td>
												Rs {product.currentPrice.$numberDecimal}
											</td>
											<td>{product.category}</td>
											<td>{product.timer}</td>
											<td>
												<Button
													variant="danger"
													className="btn-sm"
													onClick={() => {
														const arr = auctionProducts.filter(
															(el) => el._id != product._id
														);
														setAuctionProducts(arr);
														deleteAd(product._id);
													}}
												>
													<FaTrash style={{ color: "white" }} />
												</Button>
											</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
				</Row>
			</div>
		</div>
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
	updateAdInList,
})(ProductListScreen);
