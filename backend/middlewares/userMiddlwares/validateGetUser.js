const userParamsSchema = require("../../validationSchemas/userSchemas/userParamsSchema");

const validateGetUserOrAllvideosOfUser = (req,res,next) => {

    const validation = userParamsSchema.safeParse(req.params);

    if(!validation.success) {
        return res.status(400).json({
            message : validation.error.issues[0].message
        })
    }

    next();
}

module.exports = validateGetUserOrAllvideosOfUser;