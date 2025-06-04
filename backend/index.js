const express = require('express')
const app = express();

require('dotenv').config()

const connectDB = require('./config/db')
connectDB();

const commentRouter = require('./routes/comments')
const videoRouter = require('./routes/videos')
const userRouter = require('./routes/users');
const authMiddleware = require('./middlewares/authMiddleware');

const cors = require('cors');
app.use(cors())

app.use(express.json())

app.use('/api/users',userRouter)

app.use(authMiddleware)

app.use('/api/videos',videoRouter)
app.use('/api/comments',commentRouter)


app.listen(process.env.PORT,() => console.log("App is listening on port "+process.env.PORT));



