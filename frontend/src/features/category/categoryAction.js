import { fetchAllActiveCategoryApi } from "./categoryApis"
import { setCategories } from "./categorySlice";


//fetch all active category api
export const fetchAllActiveCategory = () => async (dispatch) => {
    const data = await fetchAllActiveCategoryApi();
    if (data.status === "success") {
        dispatch(setCategories(data.data));
        return data;
    }
}