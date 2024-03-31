import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
	Row,
	Col,
	Image,
	ListGroup,
	Card,
	Button,
} from "react-bootstrap";

import { useDispatch } from "react-redux";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
	const { id: productId } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [qty, setQty] = useState(1);

	const {
		data: product,
		isLoading,
		error,
	} = useGetProductDetailsQuery(productId);
	const addToCartHandler = () => {
		dispatch(addToCart({ ...product, qty }));
		navigate("/cart");
	};

	return (
		<>
			<Link className="btn btn-light my-3" to="/">
				Go Back
			</Link>

			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">
					{error?.data?.message || error.error}
				</Message>
			) : (
				<div
					style={{
						padding: "40px 20px 40px 20px",
						boxShadow: "0 0 7px 0px #cecece",
						margin: "0 30px 20px 30px",
					}}
				>
					<Row>
						<Col
							md={5}
							style={{
								padding: "0px",
								width: "300px",
								marginRight: "40px",
							}}
						>
							<Image
								src={product.image}
								alt={product.name}
								fluid
								style={{
									width: "300px",
								}}
							/>
						</Col>
						<Col>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h3 className="bold" style={{ color: "black" }}>
										{product.name}
									</h3>
								</ListGroup.Item>

								<ListGroup.Item>
									<h4 style={{ color: "#f85606", fontWeight: "600" }}>
										Rs {product.price}
									</h4>
								</ListGroup.Item>
								<ListGroup.Item>{product.description}</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col>
							<Card>
								<ListGroup variant="flush">
									<ListGroup.Item>
										<Row>
											<Col>Price:</Col>
											<Col>
												<strong>Rs {product.price}</strong>
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Status:</Col>
											<Col>
												<strong>
													{product.countInStock > 0
														? "In Stock"
														: "Out of Stock"}
												</strong>
											</Col>
										</Row>
									</ListGroup.Item>
									{product.countInStock > 0 && (
										<ListGroup.Item>
											<Row>
												<Col>Qty</Col>
												<Col>
													<Form.Control
														type="number"
														value={qty}
														onChange={(e) => {
															if (e.target.value == "") {
																return;
															} else if (
																e.target.value <= product.countInStock
															) {
																setQty(Number(e.target.value));
															} else if (
																e.target.value > product.countInStock
															) {
																setQty(Number(product.countInStock));
															}
														}}
														min="1"
														max={product.countInStock}
														className="addToCartQty"
														style={{ width: "100px" }}
													></Form.Control>
												</Col>
											</Row>
										</ListGroup.Item>
									)}
									<ListGroup.Item>
										<Button
											className="btn-block"
											type="button"
											disabled={product.countInStock === 0}
											onClick={addToCartHandler}
										>
											Add To Cart
										</Button>
									</ListGroup.Item>
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</div>
			)}
		</>
	);
};

export default ProductScreen;
