import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// Components
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import Register from "./components/Register.js";
import Ad from "./components/Ad.js";
import AdForm from "./components/AdForm.js";
import Nav from "./components/Nav.js";
import Dashboard from "./components/Dashboard.js";
import ShippingScreen from "./screens/ShippingScreen.jsx";
import PaymentScreen from "./screens/PaymentScreen.jsx";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.jsx";
import OrderScreen from "./screens/OrderScreen.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";

//Admin
import OrderListScreen from "./screens/admin/OrderListScreen.jsx";
import ProductListScreen from "./screens/admin/ProductListScreen.jsx";
import ProductEditScreen from "./screens/admin/ProductEditScreen.jsx";
import ProductsCategory from "./screens/ProductsCategory.jsx";

import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
// Actions
import { loadUser } from "./actions/auth.js";
// Redux
import { Provider } from "react-redux";
import store from "./store.js";
import CartScreen from "./screens/CartScreen.jsx";
import AdminRoute from "./components/AdminRoute.js";
import Orders from "./components/Orders.js";
import PageNotFound from "./components/PageNotFound.js";

function App() {
	// Load user
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<PayPalScriptProvider deferLoading={true}>
				<BrowserRouter>
					<Nav />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/ads/:adId" element={<Ad />} />
						<Route path="/postad" element={<AdForm />} />
						<Route path="/dashboard" element={<Dashboard />} />

						<Route path="/product/:id" element={<ProductScreen />} />
						<Route path="/shipping" element={<ShippingScreen />} />
						<Route path="/payment" element={<PaymentScreen />} />
						<Route
							path="/placeorder"
							element={<PlaceOrderScreen />}
						/>
						<Route path="/order/:id" element={<OrderScreen />} />
						<Route path="/cart" element={<CartScreen />} />
						<Route path="/orders" element={<Orders />} />
						<Route
							path="/products/:category"
							element={<ProductsCategory />}
						/>
						<Route path="/admin" element={<AdminRoute />}>
							<Route path="orderlist" element={<OrderListScreen />} />
							<Route
								path="productlist"
								element={<ProductListScreen />}
							/>
							<Route
								path="product/:id/edit"
								element={<ProductEditScreen />}
							/>
						</Route>
						<Route path="*" element={<PageNotFound />} />
					</Routes>
				</BrowserRouter>
			</PayPalScriptProvider>
		</Provider>
	);
}

export default App;
