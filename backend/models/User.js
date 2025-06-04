const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        _id : {
            type : String,
            required : true,
        },
        name : {
            type : String,
            required : [true,'Name is required!'],
            unique : true,
            trim : true,
            minlength : [3,'Name must be at least 3 characters'],
            maxlength : [30,'Name cannot exceed 30 characters']
        },
        emailId : {
            type : String,
            required : [true,'Email address is required!'],
            trim : true,
            unique : true,
            match : [/^\S+@\S+\.\S+$/,'Please enter a valid email address']
        },
        avatar : {
            type : String,
            default : 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
        },
        bio : {
            type : String,
            maxlength : 160,
            default : ''
        },
        followers : {
            type : [String],
            ref : 'User',
            validate : {
                validator : (arr) => {
                    return new Set(arr).size === arr.length
                },
                message : "Duplicate followers are not allowed"
            }
        },
        following : {
            type : [String],
            ref : 'User',
            validate : {
                validator : (arr) => {
                    return new Set(arr).size === arr.length
                },
                message : "Duplicate followings are not allowed"
            }
        },
        videos : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Video'
        }],
    },
    {
        timestamps : true
    }
)

const User = mongoose.model('User',userSchema);

module.exports = User;