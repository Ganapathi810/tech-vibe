const express = require('express');
const commentRouter = express.Router();

const {
    getRepliesPerPage,
    createComment,
    updateComment,
    deleteComment,
    getCommentsPerPage,
    updateCommentReaction
} = require('../controllers/commentController');
const validateGetCommentsOrReplies = require('../middlewares/commentMiddlewares/validateGetCommentsOrReplies');
const validateCreateComment = require('../middlewares/commentMiddlewares/validateCreateComment');
const validateDeleteComment = require('../middlewares/commentMiddlewares/validateDeleteComment');
const validateUpdateCommentReaction = require('../middlewares/commentMiddlewares/validateUpdateCommentReaction');
const validateUpdateComment = require('../middlewares/commentMiddlewares/validateUpdateComment');


commentRouter.get('/:videoId',validateGetCommentsOrReplies, getCommentsPerPage);
commentRouter.get('/:videoId/:commentId/replies',validateGetCommentsOrReplies,getRepliesPerPage);
commentRouter.post('/:videoId',validateCreateComment,createComment);
commentRouter.put('/:commentId',validateUpdateComment, updateComment);
commentRouter.put('/:commentId/reaction',validateUpdateCommentReaction,updateCommentReaction);
commentRouter.delete('/:commentId',validateDeleteComment, deleteComment);


module.exports = commentRouter;


