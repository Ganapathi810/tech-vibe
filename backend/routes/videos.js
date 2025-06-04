const videoRouter = require('express').Router();
const {
    getVideo,
    createVideo,
    deleteVideo,
    updateVideo,
    getVideosPerPage,
    updateVideoReaction,
    updateVideoViewCount,
    getVideosPerPageOnUserProfile
} = require('../controllers/videoControllers');
const validateCreateVideo = require('../middlewares/videoMiddlewares/validateCreateVideo');
const validateGetVideoOrDeleteVideo = require('../middlewares/videoMiddlewares/validateGetVideoOrDeleteVideo');
const validateGetVideos = require('../middlewares/videoMiddlewares/validateGetVideos');
const validateUpdateVideoReaction = require('../middlewares/videoMiddlewares/validateUpdateVideoReaction');
const validateVideoUpdate = require('../middlewares/videoMiddlewares/validateVideoUpdate');


videoRouter.get('/',validateGetVideos,getVideosPerPage)
videoRouter.get('/users/:userId',validateGetVideos,getVideosPerPageOnUserProfile)
videoRouter.get('/:videoId',validateGetVideoOrDeleteVideo,getVideo); 
videoRouter.post('/',validateCreateVideo,createVideo);
videoRouter.put('/:videoId/reaction',validateUpdateVideoReaction, updateVideoReaction);
videoRouter.delete('/:videoId',validateGetVideoOrDeleteVideo,deleteVideo)
videoRouter.put('/:videoId/view',updateVideoViewCount)
videoRouter.put('/:videoId',validateVideoUpdate,updateVideo)


module.exports = videoRouter;