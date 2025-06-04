const zod = require('zod')

const userParamsSchema = zod.object({
    userId : zod.string()
}) 

module.exports = userParamsSchema;