import { fetchActiveDealsApi } from "./dealApis.js";
import { setDeals, setLoading, setError } from "./dealSlice.js";

// Fetch active deals
export const fetchActiveDeals = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await fetchActiveDealsApi();
    if (data.status === "success") {
      dispatch(setDeals(data.data || []));
    } else {
      dispatch(setError(data.message));
    }
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};
