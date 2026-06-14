import { fetchAllActiveSubCategoryApi, fetchAllSubCategoryCountApi } from "./subCategoryApis.js"
import { setSubCategories, setTotalSubCategories, setLoading } from "./subCategorySlice.js";

// fetch total count of all active subcategories
export const fetchSubCategoryCount = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const data = await fetchAllSubCategoryCountApi();
        if (data.status === "success") {
            dispatch(setTotalSubCategories(data.total));
            return data;
        }
    } catch (error) {
        console.error(error);
    } finally {
        dispatch(setLoading(false));
    }
};

//fetch all data from subcategory apis
export const fetchAllActiveSubCategory = (categoryId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const data = await fetchAllActiveSubCategoryApi(categoryId);
        if (data.status === "success") {
            dispatch(setSubCategories(data.data));
            return data;
        }
    } catch (error) {
        console.error(error);
    } finally {
        dispatch(setLoading(false));
    }
}