import axios from "axios"

export const uploadFile = async (file,uploadUrl) => {
    try {
        await axios.put(uploadUrl,file,{
            headers : {
                'Content-Type' : file.type
            }
        })
    } catch (error) {
        console.log('Failed to upload file to s3 bucket : '+error.message)
    }
}