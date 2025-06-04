const commentParamsSchema = require("../../validationSchemas/commentSchemas/commentParamsSchema");


const validateDeleteComment = (req,res,next) => {
    const paramsValidation = commentParamsSchema.safeParse(req.params)

    if(!paramsValidation.success) {
        return res.status(400).json({
            message : paramsValidation.error.issues[0].message
        })
    }

    next();
}

module.exports = validateDeleteComment;