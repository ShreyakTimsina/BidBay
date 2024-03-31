import { apiSlice } from "./apiSlices";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createOrder: builder.mutation({
			query: (order) => ({
				url: ORDERS_URL,
				method: "POST",
				body: { ...order },
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
		}),
		getOrderDetails: builder.query({
			query: (id) => ({
				url: `${ORDERS_URL}/${id}`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			keepUnusedDataFor: 5,
		}),
		payOrder: builder.mutation({
			query: ({ orderId, details }) => ({
				url: `${ORDERS_URL}/${orderId}/pay`,
				method: "PUT",
				body: { ...details },
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
		}),
		getPaypalClientId: builder.query({
			query: () => ({
				url: PAYPAL_URL,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			keepUnusedDataFor: 5,
		}),
		getMyOrders: builder.query({
			query: () => ({
				url: `${ORDERS_URL}/mine`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			keepUnusedDataFor: 5,
		}),
		getOrders: builder.query({
			query: () => ({
				url: ORDERS_URL,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			keepUnusedDataFor: 5,
		}),
		deliverOrder: builder.mutation({
			query: (orderId) => ({
				url: `${ORDERS_URL}/${orderId}/deliver`,
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useGetOrderDetailsQuery,
	usePayOrderMutation,
	useGetPaypalClientIdQuery,
	useGetMyOrdersQuery,
	useGetOrdersQuery,
	useDeliverOrderMutation,
} = orderApiSlice;
