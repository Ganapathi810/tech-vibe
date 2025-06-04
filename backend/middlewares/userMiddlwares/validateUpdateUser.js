const updateUserBodySchema = require("../../validationSchemas/userSchemas/updateUserBodySchema");
const userParamsSchema = require("../../validationSchemas/userSchemas/userParamsSchema");

const validateUpdateUser = (req,res,next) => {

    const bodyValidation = updateUserBodySchema.safeParse(req.body);
    const paramsValidation = userParamsSchema.safeParse(req.params);

    if(!bodyValidation.success) {
        return res.status(400).json({
            message : bodyValidation.error.issues[0].message
        })
    }
    if(!paramsValidation.success) {
        return res.status(400).json({
            message : paramsValidation.error.issues[0].message
        })
    }

    next();
}

module.exports = validateUpdateUser;