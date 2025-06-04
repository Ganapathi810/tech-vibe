const zod = require('zod')
const mongoose = require('mongoose')

const createCommentBodySchema = zod.object({
    userId : zod.string(),
    text : zod.string().nonempty(),
    parentcommentId : zod.string().refine((id) => mongoose.Types.ObjectId.isValid(id)).optional()
}) 

module.exports = createCommentBodySchema;