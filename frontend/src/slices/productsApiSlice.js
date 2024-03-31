import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlices";

export const productsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query({
			query: () => ({
				url: PRODUCTS_URL,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			providesTags: ["Product"],
			keepUnusedDatafor: 5,
		}),
		getProductDetails: builder.query({
			query: (productId) => ({
				url: `${PRODUCTS_URL}/${productId}`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			keepUnusedDataFor: 5,
		}),
		createProduct: builder.mutation({
			query: (data) => ({
				url: `${PRODUCTS_URL}`,
				method: "POST",
				body: { ...data },
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			invalidatesTags: ["Product"],
		}),
		updateProduct: builder.mutation({
			query: (data) => ({
				url: `${PRODUCTS_URL}/${data.productId}`,
				method: "PUT",
				body: { ...data },
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
			invalidatesTags: ["Products"],
		}),
		uploadProductImage: builder.mutation({
			query: (data) => ({
				url: `${UPLOAD_URL}`,
				method: "POST",
				body: { file: data.image },
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
		}),
		deleteProduct: builder.mutation({
			query: (productId) => ({
				url: `${PRODUCTS_URL}/${productId}`,
				method: "DELETE",
				body: { token: localStorage.token },
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}),
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductDetailsQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useUploadProductImageMutation,
	useDeleteProductMutation,
} = productsApiSlice;
