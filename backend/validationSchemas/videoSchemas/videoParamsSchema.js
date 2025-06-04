const mongoose = require('mongoose')
const zod = require('zod')

const videoParamsSchema = zod.object({
    videoId : zod.string().refine((id) => mongoose.Types.ObjectId.isValid(id))
}) 

module.exports = videoParamsSchema;