import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { useState } from "react";
import {
	Box,
	ButtonGroup,
	TableRow,
	TableCell,
	TableHead,
	TableBody,
} from "@mui/material";
import {
	paginationStyle,
	purchasedListContainerStyle,
	purchasedListTableStyle,
} from "../../components/css/dashStyle";

const OrderListScreen = () => {
	const { data: orders, isLoading, error } = useGetOrdersQuery();
	const [pageNumber, setPageNumber] = useState(1);
	const [adPerPage] = useState(15);
	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return <Message variant="danger">{error}</Message>;
	}

	// Ensure orders is an array before mapping over it
	if (!Array.isArray(orders)) {
		return (
			<Message variant="danger">Orders data is invalid.</Message>
		);
	}
	let lastAdIndex = pageNumber * adPerPage;
	let firstAdIndex = lastAdIndex - adPerPage;
	let pageNumbers = [];
	const num = Math.ceil(orders.length / adPerPage);
	for (let i = 1; i <= num; i++) {
		pageNumbers.push(i);
	}
	const clickPageNumberButton = (num) => {
		setPageNumber(num);
	};
	return (
		<>
			<h1>Orders</h1>
			<Table striped bordered hover responsive className="table-sm">
				<thead>
					<tr>
						<th>ID</th>
						<th>USER</th>
						<th>DATE</th>
						<th>TOTAL</th>
						<th>PAID</th>
						<th>DELIVERED</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{orders &&
						orders.slice(firstAdIndex, lastAdIndex).map((order) => (
							<tr key={order._id}>
								<td>{order._id}</td>
								<td>{order.user && order.user.username}</td>
								<td>{order.createdAt.substring(0, 10)}</td>
								<td>Rs {order.totalPrice}</td>
								<td>
									{order.isPaid ? (
										order.createdAt.substring(0, 10)
									) : (
										<FaTimes style={{ color: "red" }} />
									)}{" "}
								</td>
								<td>
									{order.isDelivered ? (
										order.deliveredAt.substring(0, 10)
									) : (
										<FaTimes style={{ color: "red" }} />
									)}{" "}
								</td>
								<td>
									<LinkContainer to={`/order/${order._id}`}>
										<Button variant="light" className="btn-sm">
											Details
										</Button>
									</LinkContainer>
								</td>
							</tr>
						))}
				</tbody>
			</Table>
			{orders.length !== 0 && (
				<Box sx={paginationStyle}>
					<ButtonGroup variant="outlined" size="small">
						<Button
							disabled={pageNumber === 1}
							onClick={(e) => clickPageNumberButton(pageNumber - 1)}
							style={{ margin: "0 10px" }}
						>
							Prev
						</Button>
						{pageNumbers.map((num) => {
							return (
								<Button
									key={num}
									disabled={pageNumber === num}
									onClick={(e) => clickPageNumberButton(num)}
									style={{ margin: "0 2px" }}
								>
									{num}
								</Button>
							);
						})}
						<Button
							disabled={
								pageNumber === pageNumbers[pageNumbers.length - 1]
							}
							onClick={(e) => clickPageNumberButton(pageNumber + 1)}
							style={{ margin: "0 10px" }}
						>
							Next
						</Button>
					</ButtonGroup>
				</Box>
			)}
		</>
	);
};
export default OrderListScreen;
