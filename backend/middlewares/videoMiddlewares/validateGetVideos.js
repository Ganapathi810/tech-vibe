const videoQuerySchema = require("../../validationSchemas/videoSchemas/videoQuerySchema");

const validateGetVideos = (req,res,next) => {

    const validation = videoQuerySchema.safeParse(req.query);

    if(!validation.success) {
        return res.status(400).json({
            message : validation.error.issues[0].message
        })
    }

    next();
}

module.exports = validateGetVideos;