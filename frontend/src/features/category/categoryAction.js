import { fetchAllActiveCategoryApi } from "./categoryApis"
import { setCategories, setLoading } from "./categorySlice";


//fetch all active category api
export const fetchAllActiveCategory = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const data = await fetchAllActiveCategoryApi();
        if (data.status === "success") {
            dispatch(setCategories(data.data));
            return data;
        }
    } catch (error) {
        console.error(error);
    } finally {
        dispatch(setLoading(false));
    }
}