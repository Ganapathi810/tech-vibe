const commentParamsSchema = require("../../validationSchemas/commentSchemas/commentParamsSchema");
const commentQuerySchema = require("../../validationSchemas/commentSchemas/commentQuerySchema")

const validateGetCommentsOrReplies = (req,res,next) => {

    const queryValidation = commentQuerySchema.safeParse(req.query);
    const paramsValidation = commentParamsSchema.safeParse(req.params)

    if(!paramsValidation.success) {
        return res.status(400).json({
            message : paramsValidation.error.issues[0].message
        })
    }

    if(!queryValidation.success) {
        return res.status(400).json({
            message : queryValidation.error.issues[0].message
        })
    }

    next();
}

module.exports = validateGetCommentsOrReplies;