const Comment = require('../models/Comment')

exports.getRepliesPerPage = async (req,res) => {
    try {
        const { page,limit } = req.query;
        const repliesPerPage = await Comment.find({ videoId : req.params.videoId,parentCommentId : req.params.commentId})
            .populate('userId','name avatar')
            .populate({
                path : 'replies',
                populate : {
                    path : 'userId',
                    select : 'name avatar'
                }
            })
            .skip((page-1)*limit)
            .limit(limit)

        res.status(200).json({repliesPerPage})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to fetch comments' })
    }
}

exports.getCommentsPerPage = async (req,res) => {
    try {
        
        const { page,limit,sort } = req.query;
        const sortCondition = sort && sort === 'latest' ? { createdAt : -1 } : {};

        const commentsPerPage = await Comment.find({videoId : req.params.videoId,parentCommentId : null})
            .populate('userId','name avatar')
            .populate({
                path : 'replies',
                populate : {
                    path : 'userId',
                    select : 'name avatar'
                }
            })
            .sort(sortCondition)
            .skip((page-1)*limit)
            .limit(limit)

        res.status(200).json({commentsPerPage})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to fetch comments' })
    }
}
exports.createComment = async (req,res) => {
    try {
        const { videoId } = req.params;
        const { userId,text,parentCommentId } = req.body;

        const newComment = await Comment.create({
            videoId,
            userId,
            text,
            parentCommentId : parentCommentId || null,
        });

        res.status(201).json(newComment);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to create comment'})
    }
}

exports.updateComment = async (req,res) => {
    try {
        const commentOrReplyId = req.params.commentId ;

        const comment = await Comment.findById(commentOrReplyId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        let updateOperation;
        
        if(req.body.text) {
            updateOperation = { text : req.body.text }
        }

        if(req.body.replyId && req.body.action === 'add') {
            updateOperation =  {
                $push : { replies : req.body.replyId } 
            }
        }

        if(req.body.replyId && req.body.action === 'delete') {
            updateOperation =  {
                $pull : { replies : req.body.replyId } 
            }
        }

        const updatedcomment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            updateOperation,
            { new : true }
        )
        
        if(!updatedcomment) {
            return res.status(404).json({ message : 'Comment not found'})
        }

        res.status(200).json(updatedcomment);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to update comment'})
    }
}

exports.updateCommentReaction = async (req,res) => {
    try {
        const { userId, action } = req.body;

        const comment = await Comment.findById(req.params.commentId)

        hasLiked = comment.likes.includes(userId);
        hasDisliked = comment.dislikes.includes(userId);

        if(action === 'like')
            if(hasLiked)
                comment.likes.pull(userId)
            else {
                comment.likes.push(userId)
                comment.dislikes.pull(userId)
            }

        if(action === 'dislike')
            if(hasDisliked)
                comment.dislikes.pull(userId)
            else {
                comment.dislikes.push(userId)
                comment.likes.pull(userId)
            }

        await comment.save();

        if(!comment) return res.status(404).json({ message : 'comment not found'})
        
        res.status(200).json(comment)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to update comment reaction'})
    }
}

exports.deleteComment = async (req,res) => {
    try {
        const commentToDelete = await Comment.deleteOne({ _id : req.params.commentId});

        if(!commentToDelete) {
            return res.status(404).json({message : "Comment not found!"})
        }

        await Comment.deleteMany({ parentCommentId : req.params.commentId});

        res.status(200).json({ message : 'Comment and its replies deleted successfully!'});

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to delete comment'})
    }
}