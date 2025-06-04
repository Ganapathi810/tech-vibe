const zod = require('zod')

const videoUpdateBodyReactionSchema = zod.object({
    action : zod.string().nonempty(),
}) 


module.exports = videoUpdateBodyReactionSchema;