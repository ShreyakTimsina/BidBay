import React from "react";
import { connect } from "react-redux";
import { Dropdown } from "react-bootstrap";
import { Link as RouterLink } from "react-router-dom";
// Material UI Componeents
import { Button, Link } from "@mui/material";
// Files
import "./css/nav.css";
import logo from "../images/logo.png";
// Actions
import { logout } from "../actions/auth";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const Nav = (props) => {
	return (
		<div className="nav">
			<div className="nav__group1">
				<div className="nav__image-container">
					<RouterLink to="/">
						<img
							className="nav__icon"
							src={logo}
							alt="navicon"
							href="/"
						></img>
					</RouterLink>
				</div>
			</div>

			<div className="nav__group2">
				<div className="nav__buttons">
					{props.isAuth ? (
						<>
							<Dropdown>
								<Dropdown.Toggle
									id="dropdown-basic"
									style={{ backgroundColor: "transparent" }}
								>
									<FaUser style={{ marginRight: "10px" }} />
									{props.user.username}
								</Dropdown.Toggle>

								<Dropdown.Menu>
									<Dropdown.Item>
										<RouterLink
											to="/dashboard"
											color="inherit"
											style={{ textDecoration: "none" }}
										>
											My Profile
										</RouterLink>
									</Dropdown.Item>
									<Dropdown.Item>
										<RouterLink
											to="/orders"
											color="inherit"
											style={{ textDecoration: "none" }}
										>
											My Orders
										</RouterLink>
									</Dropdown.Item>
									{props.user.isAdmin && (
										<>
											<Dropdown.Item>
												<RouterLink
													to="/admin/productlist"
													color="inherit"
													style={{ textDecoration: "none" }}
												>
													Products
												</RouterLink>
											</Dropdown.Item>
											<Dropdown.Item>
												<RouterLink
													to="/admin/orderlist"
													color="inherit"
													style={{ textDecoration: "none" }}
												>
													Orders
												</RouterLink>
											</Dropdown.Item>
										</>
									)}
									<Dropdown.Item>
										<RouterLink
											href="/login"
											color="inherit"
											onClick={props.logout}
											style={{
												textDecoration: "none",
											}}
										>
											Logout
										</RouterLink>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							<RouterLink
								to="/cart"
								style={{ textDecoration: "none" }}
							>
								<Button>
									<FaShoppingCart />
								</Button>
							</RouterLink>
						</>
					) : (
						<Link
							to="/login"
							style={{
								textDecoration: "none",
								color: "black",
								border: "2px solid black",
								padding: "8px 20px",
							}}
						>
							Login
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuth: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Nav);
