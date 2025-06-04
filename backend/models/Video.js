const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
        title : {
            type : String,
            required : [true,'Title is required'],
            maxlength : [100,'title cannot exceed 100 characters'],
            trim : true
        },
        description : {
            type : String,
            required : [true,'Description is required'],
            maxlength : [500,'Description cannot exceed 500 characters'],
            trim : true
        },
        url : {
            type : String,
            required : true,
        },
        thumbnail : {
            type : String,
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
        userId : {
            type : String,
            ref : 'User',
            required : true
        },
        views : {
            type : Number,
            default : 0
        },
        comments : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Comment',
            }
        ],
        tags : [{
            type : String,
            trim : true  
        }]
    },
    {
        timestamps : true
    }
)

const Video = mongoose.model('Video',videoSchema);

module.exports = Video;