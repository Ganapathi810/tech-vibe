import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo1.jpeg'
import { handleSubmit } from '../../utils/authUtils'
import { Loading } from '../../components/Loading'

export const Signin = () => { 
    const [error,setError] = useState(null);
    const [isSignInLinkSent,setIsSignInLinkSent] = useState(false);
    const [userData,setUserData] = useState({
        emailId : ''
    });
    const [loading,setLoading]  = useState(false)

    const handleChange = (e) => {
        const { name,value } = e.target;
        setUserData((prevData) => ({
           ...prevData,
           [name] : value 
        }));
    }

    return <div className="h-screen bg-gray-950 lg:flex lg:justify-center lg:items-center">
            <div className='h-full p-1 lg:p-0 lg:flex lg:h-4/5 lg:w-2/3 bg-gray-950 rounded-lg shadow-lg border border-violet-400/40'>
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
                <div className='p-5 w-full ring-4 ring-violet-500  lg:ring-0 h-full lg:w-1/2 rounded'>
                    <div className='mt-9 lg:mt-0 flex flex-col items-center lg:hidden'>
                        <div className='text-3xl tracking-widest  font-semibold'><span className='text-violet-500'>Tech</span><span className='text-white italic'>Vibe</span></div>
                        <img 
                            src={logo} 
                            alt='logo'  
                            className='mt-3 h-12 w-24 object-cover rounded-3xl shadow-2xl'
                        />
                    </div>
                <div className='mt-2 text-3xl text-white font-bold w-full flex justify-center tracking-wider'>Sign in</div>
                <div className='w-full text-center text-lg  mt-1 tracking-wider text-gray-300'>Enter your credentials to access your feed</div>
                <div className='flex flex-col items-center mt-6'>
                    <form
                        onSubmit={(e) => handleSubmit(e,userData,setIsSignInLinkSent,setError,setLoading)} 
                        className='mt-5 w-11/12 flex flex-col items-center xl:px-4'
                >
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
                        Sign in
                    </button>
                </form>
                <div className='text-gray-400 text-center mt-2'>
                    Don't have an account? 
                    <span className='ml-1 text-white hover:underline hover:decoration-1 hover:decoration-violet-300'>
                    <Link to='/signup'>Sign up</Link>
                    </span>
                </div>
                </div>
                {loading && <Loading loadingMessage={''} />}
                {isSignInLinkSent && <div className='border border-green-200 py-2 px-0 text-center mx-8 mt-4 bg-green-900/40'>
                    <span className='text-green-200  font-serif'>Sign in Link has been sent to your email</span>
                </div>
                }       
                {error && <div className='flex gap-x-1.5 items-center mt-5 justify-center'>
                    <svg height="32" className='size-4 mt-0.5 ' style={{overflow:"visible",enableBackground :"new"}} viewBox="0 0 32 32" width="32" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style={{fill:"#D72828"}}/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style={{fill:"#E6E6E6"}}/></g></g></g></svg>
                    <p className='text-wrap text-red-400 text-center'>{error}</p>
                </div>
                }
            </div>
        </div>
    </div>
}
