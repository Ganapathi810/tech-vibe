const userRouter = require('express').Router();
const {
    getUser,
    signupUser,
    updateUser,
    getAllVideosOfUser,
    checkIfUserExists,
    getUploadUrl,
    getSignedUrlForDisplay,
    userFollowing,
    userUnfollowing
} = require('../controllers/userControllers');
const authMiddleware = require('../middlewares/authMiddleware');
const validateGetUserOrAllvideosOfUser = require('../middlewares/userMiddlwares/validateGetUser');
const validateUpdateUser = require('../middlewares/userMiddlwares/validateUpdateUser');
const validateUserSignupBody = require('../middlewares/userMiddlwares/validateUserSignupBody');


userRouter.post('/signup',validateUserSignupBody,signupUser);
userRouter.get('/check-user/:emailId',checkIfUserExists);

userRouter.use(authMiddleware)

userRouter.get('/get-signed-url',getSignedUrlForDisplay)
userRouter.get('/upload/get-upload-url',getUploadUrl)
userRouter.get('/:userId/videos',validateGetUserOrAllvideosOfUser,getAllVideosOfUser); 
userRouter.get('/:userId',validateGetUserOrAllvideosOfUser,getUser);
userRouter.put('/:userId',validateUpdateUser,updateUser);
userRouter.post('/:userId/follow',validateUpdateUser,userFollowing);
userRouter.delete('/:userId/follow',validateUpdateUser,userUnfollowing);


module.exports = userRouter;