import { apiProcessor } from "../../helpers/axiosHelper.js";

// Fetch all products with aligned query parameters matching the action creator
export const fetchAllProductsApi = async (page = 1, limit = 10, sort = '', category = '', subCategory = '', minPrice = '', maxPrice = '', rating = '', search = '') => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/products?page=${page}&limit=${limit}&sort=${sort}&category=${category}&subcategory=${subCategory}&subCategory=${subCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&rating=${rating}&search=${search}`,
    method: "GET",
  });
};

// Fetch product by ID (fixed template literal syntax)
export const getProductByIdApi = async (id) => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/products/${id}`,
    method: "GET",
  });
};

// Fetch featured products
export const getFeaturedProductsApi = async (page = 1, limit = 10) => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/products/featured?page=${page}&limit=${limit}`,
    method: "GET",
  });
};

// Fetch products by tags
export const getProductsByTagsApi = async (tags, page = 1, limit = 10) => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/products/tags?tags=${tags}&page=${page}&limit=${limit}`,
    method: "GET",
  });
};