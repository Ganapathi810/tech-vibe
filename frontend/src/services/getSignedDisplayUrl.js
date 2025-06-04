import api from "../../config/api"

export const getSignedDisplayUrl = async (filePath) => {
    try {
        const response = await api.get(`/api/users/get-signed-url?filePath=${filePath}`)
        return response.data
    } catch (error) {
        console.log('Failed to get the signed url : '+error.message)
        throw new Error(error)
    }
}