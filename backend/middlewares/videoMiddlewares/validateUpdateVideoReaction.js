const videoParamsSchema = require("../../validationSchemas/videoSchemas/videoParamsSchema");
const videoUpdateBodyReactionSchema = require("../../validationSchemas/videoSchemas/videoUpdateBodyReactionSchema");

const validateUpdateVideoReaction = (req,res,next) => {
    const paramsValidation = videoParamsSchema.safeParse(req.params)
    const bodyValidation = videoUpdateBodyReactionSchema.safeParse(req.body);

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

module.exports = validateUpdateVideoReaction;