const zod = require('zod')
const mongoose = require('mongoose')

const videoUpdateBodySchema = zod.object({
    title : zod.string().nonempty().max(100,'Title of video cannot exceed 100 characters').optional(),
    description : zod.string().max(200,'Video description cannot exceed 200 characters').optional(),
    commentId : zod.string().refine((id) => mongoose.Types.ObjectId.isValid(id)).optional(),
    action : zod.string().nonempty().optional()
}) 

module.exports = videoUpdateBodySchema;