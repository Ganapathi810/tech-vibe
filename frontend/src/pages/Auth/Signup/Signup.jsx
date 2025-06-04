import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getIdToken,signInWithPopup } from 'firebase/auth'
import logo from '../../../assets/logo1.jpeg'
import { auth,googleProvider } from '../../../../config/firebase.js'
import { storeUserInDatebase } from './VerifyEmail.jsx';
import { handleSubmit } from '../../../utils/authUtils.js';
import { useAuth } from '../../../hooks/useAuth.js';
import api from '../../../../config/api.js';
import { Loading } from '../../../components/Loading.jsx';

export const Signup = () => {
    const { setUser,user } = useAuth()
    const [error,setError] = useState(null);
    const [isSignInLinkSent,setIsSignInLinkSent] = useState(false);
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate();

    const [userData,setUserData] = useState({
        name : '',
        emailId : ''
    });

    const handleChange = (e) => {
        const { name,value } = e.target;
        setUserData((prevData) => ({
           ...prevData,
           [name] : value 
        }));
    }

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth,googleProvider);
            const token = await getIdToken(result.user)

            const response = await api.get(`/api/users/check-user/${result.user.email}`)
            const userFromDatabase = response.data.isUserExists

            if(userFromDatabase) {
                setUser({
                    _id : result.user.uid,
                    name : result.user.displayName,
                    avatar : result.user.photoURL,
                    token,
                })
            } else {
                setUser({
                    _id : result.user.uid,
                    name : result.user.displayName,
                    avatar : result.user.photoURL,
                    token,
                })
                storeUserInDatebase(result.user)
            }
            navigate('/')
        } catch (error) {
            setError(error.message)
        }
    }

    if(user) {
        return <Navigate to='/' />
    }

    return <div className="h-screen bg-gray-950 lg:flex lg:justify-center lg:items-center">
        <div className=' h-full p-1 lg:p-0 lg:flex lg:h-4/5 lg:w-2/3 bg-gray-950 rounded-lg shadow-lg border border-violet-400/40'>
            <div className='hidden lg:flex w-full h-full lg:w-1/2 bg-violet-950/50  lg:items-center lg:justify-center'>
                <div className='flex flex-col items-center'>
                    <div className='text-4xl tracking-widest  font-semibold'><span className='text-violet-500'>Tech</span><span className='text-white italic'>Vibe</span></div>
                    <img 
                        src={logo} 
                        alt='logo'  
                        className='mt-3 h-30 w-60 object-cover rounded-3xl shadow-2xl'
                    />
                    <div className='mt-2 text-white text-3xl tracking-tight'>Your Daily Dose of <span className='text-violet-500'>Tech</span></div>
                </div>
            </div>
            <div className='p-5 w-full ring-4 ring-violet-500 lg:ring-0 h-full lg:w-1/2 rounded'>
                <div className='flex flex-col items-center lg:hidden'>
                    <div className='text-3xl tracking-widest  font-semibold'><span className='text-violet-500'>Tech</span><span className='text-white italic'>Vibe</span></div>
                    <img 
                        src={logo} 
                        alt='logo'  
                        className='mt-3 h-12 w-24 object-cover rounded-3xl shadow-2xl'
                    />
                </div>
                <div className='mt-2 text-3xl text-white font-bold w-full flex justify-center tracking-wider'>Sign up</div>
                <div className='w-full text-center text-lg  mt-1 tracking-wider text-gray-300'>Create your account</div>
                <div className='flex flex-col items-center mt-6'>
                    <form 
                        onSubmit={(e) => handleSubmit(e,userData,setIsSignInLinkSent,setError,setLoading)} 
                        className='w-11/12 flex flex-col items-center xl:px-4'
                    >
                        <label htmlFor='name' className='max-w-md tracking-tight font-sans flex justify-start w-full text-white text-xl'>
                            Name
                            <span className='ml-1 text-red-400 font-light'>*</span>
                        </label>
                        <input 
                            type='text'
                            name='name'
                            value={userData.name}
                            onChange={handleChange}
                            placeholder='John Kramer'
                            required
                            className='invalid:border-red-400 text-white max-w-md bg-black mt-2 rounded-md p-2 w-full  block border border-violet-500/50 hover:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500'
                        />
                        <label htmlFor='emailId' className='max-w-md tracking-tight font-sans mt-3 flex justify-start w-full text-white text-xl'>
                            Email
                            <span className='ml-1 text-red-400 font-light'>*</span>
                        </label>
                        <input 
                            type='email'
                            name='emailId'
                            value={userData.emailId}
                            onChange={handleChange}
                            placeholder='example@gmail.com'
                            required
                            className='text-white bg-black mt-2 max-w-md  rounded-md p-2 w-full  block border border-violet-500/50 hover:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 invalid:border-red-400'
                        />
                        <button 
                            type='submit' 
                            className='rounded-md mt-4 max-w-md bg-violet-600 hover:bg-violet-700 active:ring-2 active:ring-violet-500/80 tracking-wider w-full p-2 text-white font-sans'
                        >
                            Sign up
                        </button>
                    </form>
                    <div className='text-gray-400 text-center mt-2'>
                        Already have an account? 
                        <span 
                            onClick={() => navigate('/signin')}
                            className='ml-1 text-white hover:underline hover:decoration-1 hover:decoration-violet-300'
                        >
                            <Link to='/signin'>Sign in</Link>
                        </span>
                    </div>
                    <div className='w-11/12 mt-4 flex flex-col items-center xl:px-4'>
                        <div className='flex gap-x-2 items-center w-full sm:max-w-md'>
                            <hr className='border-t border-violet-400 flex-grow'></hr>
                            <span className='text-white text-md'>OR</span>
                            <hr className='border-t border-violet-400 flex-grow'></hr>
                        </div>
                        <button 
                            onClick={handleGoogleSignIn}
                            className='max-w-md mt-3 hover:bg-violet-700/30 border-violet-500/50 hover:border-violet-400/60 rounded-md border border-w p-2 w-full flex items-center justify-center gap-x-2'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48" className='size-6'>
                                <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>    
                            <span className='text-white tracking-wide'>Continue with Google</span>
                        </button>
                    </div>
                </div>
                
                {isSignInLinkSent && <div className='border border-green-200 py-2 px-0 text-center mx-8 mt-4 bg-green-900/40'>
                    <span className='text-green-200  font-serif'>Sign in Link has been sent to your email</span>
                </div>
                }
                {error && <div className='flex gap-x-1.5 items-center mt-5 justify-center'>
                    <svg height="32" className='size-4 mt-0.5 ' style={{overflow:"visible",enableBackground :"new"}} viewBox="0 0 32 32" width="32" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style={{fill:"#D72828"}}/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style={{fill:"#E6E6E6"}}/></g></g></g></svg>
                    <p className='text-wrap text-red-400 text-center '>{error}</p>
                </div>
                }
            </div>
        </div>
        {loading && <Loading loadingMessage={''} />}
    </div>
}