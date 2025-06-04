const zod = require('zod');

const userSignupBodySchema = zod.object({
    userId : zod.string(),
    name : zod.string().trim().min(3,'Name must be at least 3 characters long'),
    avatar : zod.string().optional(),
    emailId : zod.string().email(),
})

module.exports = userSignupBodySchema;
