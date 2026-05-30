import { apiProcessor } from "../../helpers/axiosHelper.js"


//fetch all the category from api
export const fetchAllActiveCategoryApi = async() =>{
    return apiProcessor({
        url:`${import.meta.env.VITE_ROOT_URL}/api/v1/categories`,
        method:"GET",
    })
}