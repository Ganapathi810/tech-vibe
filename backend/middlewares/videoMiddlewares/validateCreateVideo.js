const videoCreateBodySchema = require("../../validationSchemas/videoSchemas/videoCreateBodySchema");

const validateCreateVideo = (req,res,next) => {

    const validation = videoCreateBodySchema.safeParse(req.body);

    if(!validation.success) {
        return res.status(400).json({
            message : validation.error.issues[0].message
        })
    }

    next();
}

module.exports = validateCreateVideo;