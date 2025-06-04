const zod = require('zod')

const updateUserBodySchema = zod.object({
    name : zod.string().min(3,'Name must be at least 3 characters long').max(50).trim().optional(),
    bio :zod.string().nonempty().max(400,'Bio cannot exceed 400 characters').optional(),
    avatar : zod.string().optional(),
    isFollowing : zod.boolean().optional()
}) 

module.exports = updateUserBodySchema;