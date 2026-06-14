import { apiProcessor } from "../../helpers/axiosHelper.js"

// fetch count of all active subcategories
export const fetchAllSubCategoryCountApi = async () => {
    return apiProcessor({
        url: `${import.meta.env.VITE_ROOT_URL}/api/v1/subcategories`,
        method: "GET",
    });
};

//fetch all active sub category from api
export const fetchAllActiveSubCategoryApi = async(categoryId) =>{
    return apiProcessor({
        url:`${import.meta.env.VITE_ROOT_URL}/api/v1/subcategories/${categoryId}`,
        method:"GET",
    })
}