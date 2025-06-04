const mongoose = require('mongoose')
const zod = require('zod')

    const commentParamsSchema = zod.object({
        commentId : zod.string().refine((id) => mongoose.Types.ObjectId.isValid(id),{
            message : "Invalid commentId. Must be a valid MongoDB ObjectId"
        }).optional(),
        videoId : zod.string().refine((id) => mongoose.Types.ObjectId.isValid(id),{
            message : "Invalid videoId. Must be a valid MongoDB ObjectId"
        }).optional()
    }) 

module.exports = commentParamsSchema;