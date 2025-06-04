import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { UserProfile } from './pages/Profile/UserProfile'
import { VideoFeed } from './pages/videoFeed/VideoFeed'
import { Signup } from './pages/Auth/Signup/Signup'
import { Signin } from './pages/Auth/Signin'
import { VerifyEmail } from './pages/Auth/Signup/VerifyEmail'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NotFound } from './pages/NotFound'

const App = () => {
  const [showNetworkConnectionMessage,setShowNetworkConnectionMessage] = useState(false);
  const [isOnline,setIsOnline] = useState(navigator.onLine)

  const handleOffline = () => {
      setIsOnline(false)
      setShowNetworkConnectionMessage(true)
      setTimeout(() => setShowNetworkConnectionMessage(false),2000)
  }
    const handleOnline = () => {
      setIsOnline(true)
      setShowNetworkConnectionMessage(true)
      setTimeout(() => setShowNetworkConnectionMessage(false),2000)
  }

    useEffect(() => {
      window.addEventListener('offline',handleOffline)
      window.addEventListener('online',handleOnline)

      return () => {
        window.removeEventListener('offline',handleOffline)
        window.removeEventListener('online',handleOnline)
      }
  },[])

  return (
    <>
      {showNetworkConnectionMessage && <div className='fixed left-0 top-20 z-50  w-full text-center'><span className={`${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white rounded p-3`}>{isOnline ? "You are back online" : "Sorry, you are offline."}</span></div>}
       <AuthProvider>
         <Routes>
           <Route path='/signup' element={<Signup />} />
           <Route path='/signin' element={<Signin />} />
           <Route path='/verify' element={<VerifyEmail />} />
            <Route  element={<ProtectedRoute />} >
              <Route path='/' element={<Navigate to='clips/682ed75b741c63c555562ad5' />} />
              <Route path='/clips/:videoId' element={<VideoFeed />} />
              <Route path='/profile/:userId' element={<UserProfile />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </AuthProvider>

    </>
  )
}

export default App;
