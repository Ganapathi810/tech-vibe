const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected successfully")
    }
    catch(error) {
        console.log('MongoDB connection errror'+error)
    }
}

module.exports = connectDB;