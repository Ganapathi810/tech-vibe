const zod = require('zod')

const commentQuerySchema = zod.object({
    limit : zod.coerce.number().int().nonnegative(),
    page : zod.coerce.number().int().nonnegative(),
    sort : zod.string().optional()
})

module.exports = commentQuerySchema;