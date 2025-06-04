import { useEffect,useState } from 'react'
import { useLocation, useNavigate, useParams,Navigate } from 'react-router-dom'
import { ProfileHeader } from './ProfileHeader'
import { ProfileVideos } from './ProfileVideos'
import { useAuth } from '../../hooks/useAuth'
import api from '../../../config/api'

export const UserProfile = () => {
    const { user:authenticatedUser,setUser:setAuthenticatedUser } = useAuth()
    const [isYourProfile,setIsYourProfile] = useState(false);
    const [user,setUser] = useState(null);
    const { userId } = useParams();
    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const [showCreateBox,setShowCreateBox] = useState(params.get('create') === true);
    const navigate = useNavigate();

    useEffect(() => {
        setShowCreateBox(params.get('create'))
    },[location.search])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const url = userId  === 'me' ? `/api/users/${authenticatedUser._id}` : `/api/users/${userId}` 
                const response = await api.get(url);
                setUser(response.data)

            } catch (error) {
                console.log('Failed to fetch User data : '+error.message)
            } 
        }
        fetchUserData()
    },[userId])

    useEffect(() => {
        if(user && authenticatedUser){
            if(authenticatedUser._id === user._id){
                setIsYourProfile(true)
            } else {
                setIsYourProfile(false)
            }
        }
    },[authenticatedUser,user])

    const handleCloseCreateBox = () => {
        setShowCreateBox(false);
        params.delete('create');
        navigate(`${location.pathname}`,{ replace : true })
    }

    if(!authenticatedUser) {
        return <Navigate to='/signin' />
    }
   
    useEffect(() => {
        if(showCreateBox)
            document.body.style.overflow='hidden'
        else
            document.body.style.overflow='auto'
    },[showCreateBox])

    
    return <div className='flex flex-col gap-3 bg-gray-950 p-6 pt-20'>
        <div className='bg-transparent  backdrop-blur-sm border border-blue-600 shadow-lg rounded-2xl pb-2'>
            <ProfileHeader 
                user={user} 
                isYourProfile={isYourProfile} 
                authenticatedUser={authenticatedUser} 
                setAuthenticatedUser={setAuthenticatedUser}
            />
            <ProfileVideos 
                user={user} 
                isYourProfile={isYourProfile} 
                showCreateBox={showCreateBox} 
                setShowCreateBox={setShowCreateBox}
                handleCloseCreateBox={handleCloseCreateBox}
            />
        </div>
    </div>
}