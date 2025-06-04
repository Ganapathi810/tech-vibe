import { useState,useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo1.jpeg'

export const TopBar = () => {
    const { user,setUser } = useAuth()
    const [isProfileMenuOpen,setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef();
    const profileImageRef = useRef();
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true) 

    const handleOpenedProfileMenu = (e) => {
        if(
            profileMenuRef.current && !profileMenuRef.current.contains(e.target) && 
            profileImageRef.current && e.target !== profileImageRef.current
        ) {
            setIsProfileMenuOpen(false);
        }
    }

    useEffect(() => {
        window.addEventListener('mousedown',handleOpenedProfileMenu)

        return () => window.removeEventListener('mousedown',handleOpenedProfileMenu)
    },[])

    const handleLogOut = async () => {
        try {
            await signOut(auth)
            navigate('/signin')
            setUser(null)
        } catch (error) {
            console.log('Error signing out : '+error.message)
        }
    }

    const handleCreateClick = () => {
        navigate('/profile/me?create=true')
    }

    if(!user) {
        return null;
    }

    return <div className="fixed z-50 flex justify-between p-2 bg-gray-950 w-full pr-5 border-b border-gray-800/50">
        <button 
            onClick={() => {
                if(window.location.pathname.includes('/clips'))
                    window.location.reload()
                else 
                    navigate('/')
            }} 
            className='flex gap-x-2'>
            <img
                src={logo} 
                alt='logo'  
                className='h-8 w-16 hover:ring-4 hover:ring-violet-500/30 sm:h-10 sm:w-20 object-cover rounded-3xl shadow-2xl'
            />
            <span className='text-blue-500 text-2xl sm:text-3xl font-semibold'>
                Tech
                <span className='text-fuchsia-500 italic'>Vibe</span>
            </span>
        </button>
        <div className="relative flex gap-x-3">
            <button 
                onClick={() => navigate('/')}
                className="flex rounded-full gap-x-1   border border-violet-500/50 items-center justify-center  px-2 sm:px-3 bg-gray-800/80 hover:bg-violet-400/40 active:bg-violet-400/50"
            >
                <span className="text-white text-sm sm:text-md font-semibold ">Go to feed</span>
            </button>
            <button 
                onClick={handleCreateClick}
                className="flex rounded-full gap-x-1  border border-violet-500/50 items-center justify-center  px-2 sm:px-3 bg-gray-800/80 hover:bg-violet-400/40 active:bg-violet-400/50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stroke-white size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-white text-sm sm:text-md font-semibold ">Create</span>
            </button>
            <div className='relative'>
                <img
                    ref={profileImageRef}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    src={user.avatar}
                    alt='Profile photo'
                    onLoad={() => setLoading(false)}
                    className="h-8 w-8 sm:h-10 sm:w-10 hover:ring-4 hover:ring-violet-500/30 rounded-full overflow-hidden"
                />
                {loading && <div className='absolute z-10 inset-0  rounded-full bg-violet-800/30 animate-pulse'></div>}
            </div>
            
            { isProfileMenuOpen && <div ref={profileMenuRef} className="absolute z-50 top-14 right-2 rounded-lg bg-gray-800 p-2 w-52">
                <div className="flex gap-x-2 items-center">
                    <img
                        src={user.avatar}
                        alt='Profile photo'
                        className="h-10 w-10 sm:h-11 sm:w-11 rounded-full"
                    />
                    <div className="text-white text-md font-semibold">{user.name || 'no name'}</div>
                </div>
                <button 
                    onClick={() => navigate('/profile/me')}
                    className="text-md text-violet-500 w-full text-center mt-2"
                >
                    View your profile
                </button>
                <hr className='border-t border-violet-400/50 flex-grow mt-2'></hr>
                <button 
                    onClick={handleLogOut}
                    className="group mt-2 w-full hover:bg-violet-500/40 rounded-sm text-center text-white flex justify-center items-center gap-x-2"
                >
                    <svg className='group-hover:stroke-violet-400 size-7 stroke-white' stroke='currentColor' fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                    </svg>
                    <span>Log out</span>
                </button>
            </div>
            }
        </div>
      </div>
}