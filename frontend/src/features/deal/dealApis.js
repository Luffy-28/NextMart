import { apiProcessor } from "../../helpers/axiosHelper.js";

// Fetch all active deals
export const fetchActiveDealsApi = async () => {
  return apiProcessor({
    url: `${import.meta.env.VITE_ROOT_URL}/api/v1/deals`,
    method: "GET",
  });
};
