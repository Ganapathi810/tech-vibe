const zod = require('zod')

const videoQuerySchema = zod.object({
    limit : zod.coerce.number().int().nonnegative(),
    page : zod.coerce.number().int().nonnegative(),
})

module.exports = videoQuerySchema;