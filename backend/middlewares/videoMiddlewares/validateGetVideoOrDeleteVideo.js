const videoParamsSchema = require("../../validationSchemas/videoSchemas/videoParamsSchema");

const validateGetVideoOrDeleteVideo = (req,res,next) => {

    const validation = videoParamsSchema.safeParse(req.params);

    if(!validation.success) {
        return res.status(400).json({
            message : validation.error.issues[0].message
        })
    }

    next();
}

module.exports = validateGetVideoOrDeleteVideo;