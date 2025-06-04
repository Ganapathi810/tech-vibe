const commentParamsSchema = require("../../validationSchemas/commentSchemas/commentParamsSchema");
const updateCommentReactionBodySchema = require("../../validationSchemas/commentSchemas/updateCommentReactionBodySchema");

const validateUpdateCommentReaction = (req,res,next) => {
    const paramsValidation = commentParamsSchema.safeParse(req.params)
    const bodyValidation = updateCommentReactionBodySchema.safeParse(req.body);

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

module.exports = validateUpdateCommentReaction;