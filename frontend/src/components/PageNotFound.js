import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				marginTop: "100px",
			}}
		>
			<h1>404 - Not Found</h1>
			<p>The page you're looking for does not exist.</p>
			<Link to="/" className="btn btn-dark px-5 my-2">
				Home
			</Link>
		</div>
	);
}
