import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isSignInWithEmailLink, signInWithEmailLink,updateProfile } from 'firebase/auth'
import { auth } from '../../../../config/firebase.js'
import { useAuth } from '../../../hooks/useAuth.js'
import api from '../../../../config/api.js'
import defaultUserProfileImage from '../../../assets/default_profile_image.jpg'

export const VerifyEmail = () => {
    const { setUser } = useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                if(isSignInWithEmailLink(auth,window.location.href)) {

                    setLoading(true)
                    const emailId = window.localStorage.getItem('emailForSignIn');
                    
                    const queryParams = new URLSearchParams(location.search);
                    const name = queryParams.get('name')

                    if(name) {
                        const result = await signInWithEmailLink(auth,emailId,window.location.href);
                        const user = result.user
                        const token = await user.getIdToken();

                        await updateProfile(user,{ displayName : name, photoURL : 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg' });

                        setUser({
                            _id : user.uid,
                            name,
                            token,
                            avatar : defaultUserProfileImage
                        })
                        await storeUserInDatebase(user,name);
                    } else {
                        const result = await signInWithEmailLink(auth,emailId,window.location.href);
                        const user = result.user
                        const token = await user.getIdToken();

                        setUser({
                            _id : user.uid,
                            name : user.displayName,
                            token,
                            avatar : user.photoURL
                        })
                    }
                    
                    window.localStorage.removeItem('emailForSignIn');
                    navigate('/');
                }
                else {
                    throw new Error('Invalid or Expired link. Please sign up/in again.')
                }
            } catch (error) {
                setError(error.message)
                console.log('Error signing in :',error.message);
            } finally {
                setLoading(false)
            }
        }

        verifyUser();

    },[])   
    
    return <div className='bg-gray-950 flex justify-center items-center h-screen'>
        {loading && (
            <div>
                <span>
                    <svg className='text-white animate-spin' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill='currentColor' d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>
                </span>
                <div className='text-3xl text-balance text-white mt-5'>Verifying your email...</div>
            </div>
        )}
        {error && (
            <div>
                <div className='flex gap-x-3'>
                    <svg height="32" className='size-9 mt-3' style={{overflow:"visible",enableBackground :"new"}} viewBox="0 0 32 32" width="32" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style={{fill:"#D72828"}}/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style={{fill:"#E6E6E6"}}/></g></g></g></svg>
                    <span className='text-red-500 text-5xl'>{error}</span>
                </div>
                <div className='mt-3 text-gray-400 text-center'>Close the window and try signing up/in again.</div>
            </div>
        )}
    </div> 
}

export const storeUserInDatebase = async (user,name) => {
    try {
        await api.post('/api/users/signup',{
            name : name ? name : user.displayName,
            emailId : user.email,
            userId : user.uid,
            avatar : user.photoURL ? user.photoURL : defaultUserProfileImage
        })
    }
    catch (error) {
        console.log('Failed to store user data in database!',error.message);
    }
}

