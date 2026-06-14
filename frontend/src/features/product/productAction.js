import {
  fetchAllProductsApi,
  getFeaturedProductsApi,
  getProductByIdApi,
  getProductsByTagsApi,
} from "./productApis";
import {
  setLoading,
  setCategory,
  setMaxPrice,
  setMinPrice,
  setPagination,
  setProduct,
  setProducts,
  setRating,
  setSearch,
  setSubCategory,
  setTrendingProduct,
  setFeaturedProduct,
} from "./productSlice.js";

//fetch all products api
export const fetchAllProducts =
  (
    page,
    limit,
    sort,
    category,
    subCategory,
    minPrice,
    maxPrice,
    rating,
    search,
  ) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await fetchAllProductsApi(
        page,
        limit,
        sort,
        category,
        subCategory,
        minPrice,
        maxPrice,
        rating,
        search,
      );
      if (data.status == "success") {
        dispatch(setProducts(data.products || data.data));
        dispatch(setPagination(data.pagination));
        dispatch(
          setMinPrice(data.minPrice !== undefined ? data.minPrice : minPrice),
        );
        dispatch(
          setMaxPrice(data.maxPrice !== undefined ? data.maxPrice : maxPrice),
        );
        dispatch(setRating(data.rating !== undefined ? data.rating : rating));
        dispatch(
          setCategory(data.category !== undefined ? data.category : category),
        );
        dispatch(
          setSubCategory(
            data.subCategory !== undefined ? data.subCategory : subCategory,
          ),
        );
        dispatch(setSearch(data.search !== undefined ? data.search : search));
        return data;
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

//get products by tags api
export const getProductsByTags = (tags, page, limit) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await getProductsByTagsApi(tags, page, limit);
    if (data.status == "success") {
      dispatch(setTrendingProduct(data.data));
      dispatch(setPagination(data.pagination));
      return data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get product by ids
export const getProductById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await getProductByIdApi(id);
    if (data.status == "success") {
      dispatch(setProduct(data.data));
      return data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get Featured Products
export const getFeatuedProducts = (page, limit) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await getFeaturedProductsApi(page, limit);
    if (data.status == "success") {
      dispatch(setFeaturedProduct(data.products || data.data));
      dispatch(setPagination(data.pagination));
      return data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};
