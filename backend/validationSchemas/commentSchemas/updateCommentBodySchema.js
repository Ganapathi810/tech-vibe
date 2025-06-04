const zod = require('zod')
const mongoose = require('mongoose')

const updateCommentBodySchema = zod.object({
    text : zod.string().nonempty().optional(),
    replyId : zod.string().refine((id) => mongoose.Types.ObjectId.isValid(id)).optional(),
    action : zod.string().nonempty().optional()
}) 

module.exports = updateCommentBodySchema;