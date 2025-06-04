const zod = require('zod')

const videoCreateBodySchema = zod.object({
    title : zod.string().nonempty().max(100,'Title of video cannot exceed 100 characters'),
    description : zod.string().max(500,'Video description cannot exceed 500 characters'),
    url : zod.string(),
    thumbnail : zod.string()

}) 

module.exports = videoCreateBodySchema;