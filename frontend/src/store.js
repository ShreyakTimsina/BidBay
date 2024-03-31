import { configureStore } from "@reduxjs/toolkit";

import auth from "./reducers/auth";
import alert from "./reducers/alert";
import ad from "./reducers/ad";
import { apiSlice } from "./slices/apiSlices";
import cartSliceReducer from "./slices/cartSlice";

const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		cart: cartSliceReducer,
		auth: auth,
		alert: alert,
		ad: ad,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),

	devTools: true,
});

export default store;
