<h1>
  <img src="./frontend/public/favicon.jpeg" alt="Tech Vibe Logo" width="67" style="margin-right: 10px;">
  Tech Vibe
</h1>

**Tech Vibe** is a responsive web application where users can share and explore short videos focused exclusively on technology. From the latest tech news and bite-sized tutorials to personal insights and product demos, Tech Vibe provides a smooth and engaging space for tech enthusiasts to connect, create, and discover.

&#x20;

---

## 🔥 Features

- 🎥 **Short Tech Videos** — Scrollable vertical feed of tech-only content.  
- 🔐 **User Authentication** — Sign up, log in, and manage your profile securely.  
- 👤 **User Profiles** — View your own and others' videos and details.  
- 💬 **Comment System** — Interact with creators and spark discussions.
- 📤 **Share Functionality** — Easily share tech videos with others via link.  
- ➕ **Follow Creators** — Stay updated by following your favorite tech influencers.  
- 📱 **Responsive Design** — Fully functional across desktop and mobile devices.  
- ⚡ **Smooth Scrolling UI** — Intuitive vertical scroll like YouTube Shorts  

---

## 🛠 Tech Stack

- **Frontend:** React.js + Tailwind CSS + Framer Motion + React Router DOM  
- **Backend:** Node.js + Express.js + Zod (for input validation)  
- **Database:** MongoDB  
- **Auth:** Firebase Authentication (Email-based Sign-In Link and Sign-Up with Google)  
- **Storage:** Amazon S3  
- **Deployment:** Vercel (Frontend), Render (Backend)  

## 📂 Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/Ganapathi810/tech-vibe.git
   cd tech-vibe
   ```

2. **Backend Setup**

   ```sh
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**
You will need to create **two separate `.env` files**:

- `frontend/.env` – for client-side environment variables
- `backend/.env` – for server-side environment variables

  Below are the variables needed for each:



### 🔐 `frontend/.env`

```env
VITE_BACKEND_URL='your-backend-api-url'                      # Backend API base URL
VITE_FRONTEND_URL='your-frontend-api-url'                    # Local frontend dev URL
VITE_AWS_BUCKET_URL='your-s3-bucket-url'                     # Public S3 bucket URL

VITE_FIREBASE_API_KEY='your-firebase-api-key'                # Firebase Web API key
VITE_FIREBASE_AUTH_DOMAIN='your-auth-domain'                 # Firebase auth domain
VITE_FIREBASE_PROJECT_ID='your-firebase-project-id'          # Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET='your-storage-bucket'           # Firebase storage bucket URL
VITE_FIREBASE_MESSAGING_SENDER_ID='your-messaging-sender-id' # Firebase Cloud Messaging ID
VITE_FIREBASE_APP_ID='your-firebase-app-id'                  # Firebase app ID
VITE_FIREBASE_MEASUREMENT_ID='your-measurement-id'           # Firebase analytics ID
```
### 🔐 `backend/.env`
```env
MONGO_URL='your-mongodb-uri'                                 # MongoDB connection string
PORT=3000                                                    # Backend server port
FIREBASE_SERVICE_ACCOUNT='./path/to/serviceAccountKey.json'  # Path to Firebase Admin SDK JSON file
AWS_ACCESS_KEY_ID='your-aws-access-key-id'                   # AWS IAM access key
AWS_SECRET_ACCESS_KEY='your-aws-secret-access-key'           # AWS IAM secret key
AWS_REGION='your-aws-region'                                 # e.g., us-east-1
AWS_BUCKET_NAME='your-s3-bucket-name'                        # S3 bucket name
```

## 📡 API Endpoints

### 👤 /api/users

| Method | Endpoint                               | Description                                  |
|--------|----------------------------------------|----------------------------------------------|
| POST   | /api/users/signup                      | Sign up a new user                           |
| GET    | /api/users/check-user/:emailId         | Check if user exists by email                |

> 🔐 The following routes require authentication (`authMiddleware`)

| Method | Endpoint                                             | Description                                  |
|--------|------------------------------------------------------|----------------------------------------------|
| GET    | /api/users/get-signed-url                            | Get a signed URL for accessing user uploads  |
| GET    | /api/users/upload/get-upload-url                     | Get a signed S3 URL for uploading            |
| GET    | /api/users/:userId/videos                            | Get all videos uploaded by a specific user   |
| GET    | /api/users/:userId                                   | Get user profile by ID                       |
| PUT    | /api/users/:userId                                   | Update user profile                          |
| POST   | /api/users/:userId/follow                            | Follow the user                              |
| DELETE | /api/users/:userId/follow                            | Unfollow the user                            |


### 🎥 /api/videos

| Method | Endpoint                              | Description                                      |
|--------|---------------------------------------|--------------------------------------------------|
| GET    | /api/videos                           | Get paginated list of videos                    |
| GET    | /api/videos/users/:userId             | Get paginated videos for a specific user        |
| GET    | /api/videos/:videoId                  | Get a single video by ID                        |
| POST   | /api/videos                           | Upload a new video                              |
| PUT    | /api/videos/:videoId/reaction         | Update reaction (like/dislike) on a video       |
| PUT    | /api/videos/:videoId/view             | Increment video view count                      |
| PUT    | /api/videos/:videoId                  | Update video details                            |
| DELETE | /api/videos/:videoId                  | Delete a video                                  |

### 💬 /api/comments

| Method | Endpoint                                            | Description                                      |
|--------|-----------------------------------------------------|--------------------------------------------------|
| GET    | /api/comments/:videoId                              | Get paginated comments for a video              |
| GET    | /api/comments/:videoId/:commentId/replies           | Get paginated replies to a specific comment     |
| POST   | /api/comments/:videoId                              | Post a new comment on a video                   |
| PUT    | /api/comments/:commentId                            | Update a comment                                |
| PUT    | /api/comments/:commentId/reaction                   | Update reaction (like/dislike) on a comment     |
| DELETE | /api/comments/:commentId                            | Delete a comment                                |


---

Made with 💙 by **Ganapathi Othoju**
