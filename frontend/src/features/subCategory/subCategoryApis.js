import { apiProcessor } from "../../helpers/axiosHelper.js"



//fetch all active sub category from api
export const fetchAllActiveSubCategoryApi = async(categoryId) =>{
    return apiProcessor({
        url:`${import.meta.env.VITE_ROOT_URL}/api/v1/subcategories/${categoryId}`,
        method:"GET",
    })
}