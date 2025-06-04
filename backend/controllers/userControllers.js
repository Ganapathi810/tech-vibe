const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const User = require("../models/User")
const Video = require("../models/Video")
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require("../config/aws");

exports.signupUser = async (req,res) => {
    try {
        const { name,emailId,userId,avatar } = req.body;

        const existingUser = await User.findOne({ _id : userId })
            
        if(existingUser) {
            res.status(200).json({ message : "User already exists!"})
            return;
        }
        
        await User.create({
           name,
           emailId,
           _id : userId,
           avatar
        })

        res.status(200).json({ message : "User created successfully!"})
    }
    catch(error) { 
        console.log(error)
        res.status(500).json({ message : 'Failed to sign up'}) 
    }
}

exports.checkIfUserExists = async (req,res) => {
    try {
        const user = await User.findOne({ emailId : req.params.emailId});
        
        res.status(200).json({
            isUserExists : user ? user : false
        });
    }
    catch(error) { 
        console.log(error)
        res.status(500).json({ message : 'Failed to check the user'}) 
    }
}

exports.getUser = async (req,res) => {
    try {
        const user = await User.findOne({ _id : req.params.userId })
            .populate({
                path : 'followers',
                select : '_id name avatar'
            })
            .populate({
                path : 'following',
                select : '_id name avatar'
            })

        if(!user) {
            res.status(404).json({message : "User does not exists!!"})
            return
        }
        
        res.status(200).json(user);
    }
    catch(error) { 
        console.log(error)
        res.status(500).json({ message : 'Failed to fetch user'}) 
    }
}

exports.getUploadUrl = async (req,res) => {
    try {

        const { fileCategory,fileType,videoTimeStamp } = req.query;

        const userId = req.user.uid;

        let filePath;
        let timestamp = videoTimeStamp;

        if(fileCategory === 'video' && !videoTimeStamp) {
            timestamp = Date.now();
            filePath = `videos/${userId}/${timestamp}_video.mp4`;            
        } else if(fileCategory === 'thumbnail') {
            if(!videoTimeStamp) {
                return res.status(400).json({ message : 'Missing videoTimeStamp for thumbnail'});
            }
            filePath = `thumbnails/${userId}/${videoTimeStamp}_thumbnail.jpg`
        } else if(fileCategory === 'profile') {
            filePath = `profiles/${userId}_profile.jpg`
        }

        const command = new PutObjectCommand({
            Bucket : process.env.AWS_BUCKET_NAME,
            Key : filePath,
            ContentType : fileType,
        }) 
            
        const uploadUrl = await getSignedUrl(s3Client,command,{ expiresIn : 120 })        

        res.status(200).json({
            uploadUrl,
            filePath,
            timestamp
        });

    }
    catch(error) { 
        console.log(error)
        res.status(500).json({ message : `Failed to get upload url`}) 
    }
}


exports.getSignedUrlForDisplay = async (req,res) => {
    try {
        const { filePath } = req.query;

        const command = new GetObjectCommand({
            Bucket : process.env.AWS_BUCKET_NAME,
            Key : filePath,
        }) 
            
        const signedUrl = await getSignedUrl(s3Client,command,{ expiresIn : 600 })        

        res.status(200).json({
            signedUrl,
        });
    }
    catch(error) { 
        console.log(error)
        res.status(500).json({ message : 'Failed to get signed url'}) 
    }
}


exports.getAllVideosOfUser = async (req,res) => {
    try { 
        const videos = await Video.find({ userId : req.params.userId })
            .sort({ createdAt : -1})

        if (!videos.length) {
            return res.status(404).json({ message: 'No videos exists!' });
        }
        res.status(200).json({videos});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message : 'Failed to fetch all videos of user'})
    }
}

exports.updateUser = async (req,res) => {
    try {
        const { userId } = req.params;
        const existingUser = await User.findById(userId)

        if(!existingUser) {
            return res.status(404).json({ message : "User does not exist"})
        }

        let updateOperation = {};
        
        if(req.body.avatar) {
            if(req.body.avatar.includes('google') && existingUser.avatar.includes('amazonaws.com'))
                updateOperation = {}
            else
                updateOperation = {avatar : req.body.avatar}
        }
        
        if(req.body.name && req.body.bio) {
            updateOperation = { name : req.body.name,bio : req.body.bio}
        }

        if(req.body.isFollowing === true) {
            updateOperation = { $addToSet : { followers : req.body.userId }}
        } else if(req.body.isFollowing === false) {
            updateOperation = { $pull : { followers : req.body.userId }}
        }

        const user = await User.findOneAndUpdate(
            { _id : req.params.userId },
            updateOperation,
            { new : true }
        );

        res.status(200).json(user)
    }
    catch(error) { 
        console.log(error)
        res.status(500).json({ message : 'Failed to follow the user'}) 
    }
}

exports.userFollowing = async (req,res) => {
    try {
        const followingId = req.params.userId;
        const followerId = req.user.uid;

        const followerUser = await User.findByIdAndUpdate(followerId,
            { $addToSet : { following : followingId }},
            {new : true }
        )

         const followingUser = await User.findByIdAndUpdate(followingId,
            { $addToSet : { followers : followerId }},
            {new : true }
        )


        res.status(200).json({
            message : 'Followed successfully!',
            followerUser,
            followingUser
        })
    }
    catch(error) {
        console.log(error) 
        res.status(500).json({ message : 'Failed to follow the user'}) 
    }
}

exports.userUnfollowing = async (req,res) => {
    try {
        const followingId = req.params.userId;
        const followerId = req.user.uid;

        const followerUser = await User.findByIdAndUpdate(followerId,{
            $pull : { following : followingId }},
            {new : true }
        )

         const followingUser = await User.findByIdAndUpdate(followingId,{
            $pull : { followers : followerId }},
            {new : true }
        )



        res.status(200).json({
            message : 'Unfollowed successfully!',
            followerUser,
            followingUser
        })
    }
    catch(error) { 
        console.log(error)
        res.status(500).json({ message : 'Failed to unfollow the user'}) 
    }
}