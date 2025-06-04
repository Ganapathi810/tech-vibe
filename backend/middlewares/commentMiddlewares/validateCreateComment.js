const commentParamsSchema = require("../../validationSchemas/commentSchemas/commentParamsSchema");
const createCommentBodySchema = require("../../validationSchemas/commentSchemas/createCommentBodySchema");

const validateCreateComment = (req,res,next) => {

    const bodyValidation = createCommentBodySchema.safeParse(req.body);
    const paramsValidation = commentParamsSchema.safeParse(req.params)

    if(!paramsValidation.success) {
        return res.status(400).json({
            message : paramsValidation.error.issues[0].message
        })
    }
    
    if(!bodyValidation.success) {
        return res.status(400).json({
            message : bodyValidation.error.issues[0].message
        })
    }

    next();
}

module.exports = validateCreateComment;