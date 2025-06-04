import api from "../../config/api"

export const getSignedUploadUrl = async (fileType,fileCategory,timestamp) => {
    try {
        const response = await api.get(`/api/users/upload/get-upload-url?fileCategory=${fileCategory}&fileType=${fileType}${timestamp ? `&videoTimeStamp=${timestamp}` : '' }`)
        return response.data
    } catch (error) {
        console.log('Failed to get the upload url : '+ error.message)
    }
}

    

    