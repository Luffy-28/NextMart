import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    categories: [],
    subCategories: [],
    product: null,
    featuredProducts: [],
    trendingProducts: [],
    minPrice: 0,
    maxPrice: 0,
    rating: 0,
    search: null,
    loading: false,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 10,
    },
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      const product = action.payload;
      state.product = product
        ? {
            ...product,
            features: product.features || [],
            images: product.images || [],
          }
        : null;
    },
    setPagination: (state, action) => {
      state.pagination.currentPage = action.payload.currentPage;
      state.pagination.totalPages = action.payload.totalPages;
      state.pagination.totalItems = action.payload.totalItems;
      state.pagination.limit = action.payload.limit;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategory: (state, action) => {
      state.categories = action.payload;
    },
    setSubCategory: (state, action) => {
      state.subCategories = action.payload;
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setRating: (state, action) => {
      state.rating = action.payload;
    },
    setTrendingProduct: (state, action) => {
      state.trendingProducts = action.payload;
    },
    setFeaturedProduct: (state, action) => {
      state.featuredProducts = action.payload;
    },
  },
});

export const {
  setLoading,
  setProducts,
  setProduct,
  setPagination,
  setSearch,
  setCategory,
  setSubCategory,
  setMinPrice,
  setMaxPrice,
  setRating,
  setTrendingProduct,
  setFeaturedProduct,
} = productSlice.actions;
export default productSlice.reducer;
