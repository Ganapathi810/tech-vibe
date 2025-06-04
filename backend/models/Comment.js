const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        videoId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Video',
            required : true
        },
        userId : {
            type : String,
            ref : 'User',
            required : true
        },
        parentCommentId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment',
            default : null
        },
        text : {
            type : String,
            required : true
        },
        likes : [{
            type : 'String',
            ref : 'User',
            unique : true
        }],
        dislikes : [{
            type : 'String',
            ref : 'User',
            unique : true
        }],
        replies : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Comment',
            },
        ],    
    },
    {
        timestamps : true
    }
)

const Comment = new mongoose.model('Comment',commentSchema);

module.exports = Comment;