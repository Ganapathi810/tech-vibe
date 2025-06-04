const Video = require('../models/Video')
const User = require('../models/User')
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require('../config/aws');

exports.getVideosPerPage = async (req,res) => {
    try {
        const { page,limit,firstVideoId } = req.query;
        
        let videosPerPage = await Video.find({ _id : { $ne : firstVideoId }})
            .sort({ createdAt : -1})
            .populate('userId','name avatar')
            .skip((page-1)*limit)
            .limit(limit)
            
            if(page == 1) {
                const specificVideo = await Video.findById(firstVideoId).populate('userId','name avatar')
                if(specificVideo) {
                    videosPerPage.unshift(specificVideo)
                    videosPerPage.pop()
                }
            }

        res.status(200).json({videosPerPage})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : `Failed to fetch videos`})
    }
}

exports.getVideosPerPageOnUserProfile = async (req,res) => {
    try {
        const { page,limit } = req.query;
        const { userId } = req.params

        const videos = await Video.find({ userId })
            .sort({ createdAt : -1})
            .populate('userId','name avatar')
            .skip((page-1)*limit)
            .limit(limit)
            
        res.status(200).json({videosPerPage : videos})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : `Failed to fetch videos`})
    }
}



exports.getVideo = async (req,res) => {
    try { 
        const video = await Video.findById(req.params.videoId)
            .populate('userId','name avatar')

        if(!video) {
            return res.status(404).json({ message : 'Video not found'})    
        }
        res.status(200).json(video);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to fetch video'})
    }
}

exports.createVideo = async (req,res) => {
    const { title,description,url,thumbnail } = req.body
    const userId = req.user.uid;
    const tags = [];

    try {
        const video = new Video({
            userId,
            title,
            description,
            url,
            thumbnail,
            tags
        })
        await video.save();

        await User.findByIdAndUpdate(userId,{
            $push : { videos : video._id }
        })

        res.status(201).json(video)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to create video'})
    }
}


exports.updateVideo = async (req,res) => {
    try {
        let updateOperation;

        if(req.body.commentId && req.body.action === 'add'){
            updateOperation = { $push : { comments : req.body.commentId }}
        }
        
        if(req.body.commentId && req.body.action === 'delete'){
            updateOperation = { $pull : { comments : req.body.commentId }}
        }
        
        if(req.body.title && req.body.description) {
            updateOperation = { title : req.body.title, description : req.body.description }
        }

        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.videoId,
            updateOperation,
           { new : true,runValidators : true } 
        )
        if(!updatedVideo) return res.status(404).json({ message : 'video not found'})
        
        res.status(200).json(updatedVideo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to update video'})
    }
}

exports.updateVideoReaction = async (req,res) => {
    try {
        const { action } = req.body;
        const userId = req.user.uid
        const video = await Video.findById(req.params.videoId)

        hasLiked = video.likes.includes(userId);
        hasDisliked = video.dislikes.includes(userId);

        if(action === 'like')
            if(hasLiked)
                video.likes.pull(userId)
            else {
                video.likes.push(userId)
                video.dislikes.pull(userId)
            }

        if(action === 'dislike')
            if(hasDisliked)
                video.dislikes.pull(userId)
            else {
                video.dislikes.push(userId)
                video.likes.pull(userId)
            }

        await video.save();

        if(!video) return res.status(404).json({ message : 'video not found'})
        
        res.status(200).json(video)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to update video reaction'})
    }
}

exports.updateVideoViewCount = async (req,res) => {
    try {
        const { videoId } = req.params;

        const updatedVideo = await Video.findByIdAndUpdate(videoId,{
            $inc : { views : 1 }
        })

        res.status(200).json({ message : 'video view count updated successfully',updatedVideo})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to update video'})
    }
}
exports.deleteVideo = async (req,res) => {
    try {
        const { videoTimeStamp } = req.query
        const userId = req.user.uid
        const videoFileKey = `videos/${userId}/${videoTimeStamp}_video.mp4`
        const thumbnailFileKey = `thumbnails/${userId}/${videoTimeStamp}_thumbnail.jpg`
        
        const videoCommand = new DeleteObjectCommand({
            Bucket : process.env.AWS_BUCKET_NAME,
            Key : videoFileKey
        })

        const thumbnailCommand = new DeleteObjectCommand({
            Bucket : process.env.AWS_BUCKET_NAME,
            Key : thumbnailFileKey
        })
        
        await s3Client.send(videoCommand);
        await s3Client.send(thumbnailCommand);

        const videoToDelete = await Video.findById(req.params.videoId)

        if(!videoToDelete) return res.status(404).json({ message : 'video not found'})
        await videoToDelete.deleteOne()

        res.status(200).json({ message : 'video and associated thumbnail deleted successfully'})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to delete video'})
    }
}

