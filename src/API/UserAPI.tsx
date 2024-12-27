import axios from "axios"


export const loginUser = async (email: string, password: string) => {
    try {
        const body = {
            email,
            password
        }
        
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API}/api/users/login/admin`,
            body
        )
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
}