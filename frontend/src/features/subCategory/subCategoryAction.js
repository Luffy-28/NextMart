import { fetchAllActiveSubCategoryApi } from "./subCategoryApis.js"
import { setSubCategories } from "./subCategorySlice.js";

//fetch all data from subcategory apis
export const fetchAllActiveSubCategory = (categoryId) => async (dispatch) => {
    const data = await fetchAllActiveSubCategoryApi(categoryId);
    if (data.status === "success") {
        dispatch(setSubCategories(data.data));
        return data;
    }
}