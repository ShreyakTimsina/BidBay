import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

const AdminRoute = (props) => {
	const [adminCheck, setAdminCheck] = useState(false);
	useEffect(() => {
		if (props.isAuth) {
			if (props.user.isAdmin) {
				setAdminCheck(true);
			}
		}
	}, [props.loading]);
	return adminCheck ? (
		<Outlet />
	) : (
		<h2 style={{ marginTop: "20px" }}>
			You are not authorized to make this request.
		</h2>
	);
};

const mapStateToProps = (state) => ({
	loading: state.auth.loading,
	isAuth: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(mapStateToProps)(AdminRoute);
