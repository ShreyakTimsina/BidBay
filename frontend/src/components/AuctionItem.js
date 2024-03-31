import React from "react";
import Card from "./Card";

export default function AuctionItem({ ad }) {
	return (
		<div className="product__container" key={ad._id}>
			<Card ad={ad} dashCard={false} />
		</div>
	);
}
