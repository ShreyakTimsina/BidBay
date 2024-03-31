import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
// Components
import LoadingDisplay from "./LoadingDisplay";
import Card from "./Card";
import { Box } from "@mui/material";
// Styling
import {
	boardStyle,
	adAreaStyle,
	dashCardStyle,
} from "./css/dashStyle";

const DashboardAdList = (props) => {
	const [ads, setAds] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			const res = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/user/products/posted`
			);
			setAds(res.data);
			setLoading(false);
		};
		fetchData();
	}, []);

	return loading ? (
		<LoadingDisplay />
	) : (
		<Fragment>
			<Box sx={boardStyle}>
				<Box sx={adAreaStyle}>
					{ads.map((ad) => {
						if (props.admin) {
							if (ad.auctionEnded) return null;
						}
						return (
							<div className="ad__container" key={ad._id}>
								<Card
									ad={ad}
									key={ad._id}
									dashCard={true}
									cardStyle={dashCardStyle}
								/>
							</div>
						);
					})}
				</Box>
			</Box>
		</Fragment>
	);
};

export default DashboardAdList;
