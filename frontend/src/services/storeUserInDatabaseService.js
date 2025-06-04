import api from "../../config/api";

export const storeUserInDatebase = async (name,emailId) => {
    try {
        await api.post(`/api/users/signup`,{
            name,
            emailId
        })
    }
    catch (error) {
        console.log('Failed to store email in database!',error.message);
    }
}