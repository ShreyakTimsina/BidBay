export const addDecimals = (num) => {
	return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
	// Calculate item price
	state.itemsPrice = addDecimals(
		state.cartItems.reduce(
			(acc, item) => acc + item.price * item.qty,
			0
		)
	);
	// Calculat shipping price (if order is over 2000 then free, else 100 rupees)
	state.shippingPrice = addDecimals(
		state.itemsPrice > 2000 ? 0 : 100
	);
	// Calculate tax price ( 0% tax)
	state.taxPrice = addDecimals(
		Number((0.0 * state.itemsPrice).toFixed(2))
	);

	// Calculate total price
	state.totalPrice = (
		Number(state.itemsPrice) +
		Number(state.shippingPrice) +
		Number(state.taxPrice)
	).toFixed(2);
	localStorage.setItem("cart", JSON.stringify(state));
	return state;
};
