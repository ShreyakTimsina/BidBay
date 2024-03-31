import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";

import { Box, Paper, Typography } from "@mui/material";
import { boxStyle, paperStyle } from "./css/adStyles";
import LoadingDisplay from "./LoadingDisplay";
import Loader from "./Loader";
import Message from "./Message";

import DashPurchasedList from "./DashPurchasedList";
import { getUserPurchasedAds } from "../actions/ad";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";

function Orders(props) {
	useEffect(() => {
		if (props.isAuth) {
			props.getUserPurchasedAds();
		}
	}, [props.loading]);
	const { data: orders, isLoading, error } = useGetMyOrdersQuery();
	return (
		<Box sx={boxStyle}>
			<Paper sx={paperStyle}>
				<Typography variant="h5">Auction Purchases</Typography>
				{props.purchasedLoading ? (
					<LoadingDisplay />
				) : (
					<DashPurchasedList ads={props.purchased} />
				)}
				<br />
				<br />
				<h5>My Orders</h5>
				{isLoading ? (
					<Loader />
				) : error ? (
					<Message variant="danger">
						{error?.data?.message || error.error}
					</Message>
				) : (
					<Table striped hover responsive className="table-sm">
						<thead>
							<tr>
								<th>ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.createdAt.substring(0, 10)}</td>
									<td>Rs {order.totalPrice}</td>
									<td>
										{order.isPaid ? (
											order.createdAt.substring(0, 10)
										) : (
											<FaTimes style={{ color: "red" }} />
										)}
									</td>

									<td>
										{order.isDelivered ? (
											order.deliveredAt.substring(0, 10)
										) : (
											<FaTimes style={{ color: "red" }} />
										)}
									</td>
									<td>
										<LinkContainer to={`/order/${order._id}`}>
											<Button className="btn-sm" variant="light">
												Details
											</Button>
										</LinkContainer>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Paper>
		</Box>
	);
}

const mapStateToProps = (state) => ({
	loading: state.auth.loading,
	isAuth: state.auth.isAuthenticated,
	user: state.auth.user,
	purchased: state.ad.purchased,
	purchasedLoading: state.ad.purchasedLoading,
});

export default connect(mapStateToProps, { getUserPurchasedAds })(
	Orders
);
