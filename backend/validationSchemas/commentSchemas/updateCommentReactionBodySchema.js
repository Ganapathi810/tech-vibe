const zod = require('zod')

const updateCommentReactionBodySchema = zod.object({
    action : zod.string().nonempty(),
    userId : zod.string()
}) 


module.exports = updateCommentReactionBodySchema;