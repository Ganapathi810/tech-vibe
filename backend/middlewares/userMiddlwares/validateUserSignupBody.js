const userSignupBodySchema = require("../../validationSchemas/userSchemas/userSignupBodySchema");

const validateUserSignupBody = (req,res,next) => {

    const validation = userSignupBodySchema.safeParse(req.body);

    if(!validation.success) {
        return res.status(400).json({
            message : validation.error.issues[0].message
        })
    }

    next();
}

module.exports = validateUserSignupBody;