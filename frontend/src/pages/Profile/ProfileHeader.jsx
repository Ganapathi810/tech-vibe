import { useEffect, useRef, useState } from 'react';
import {  updateProfile } from 'firebase/auth';
import { FollowButton } from '../../components/FollowButton';
import api from '../../../config/api';
import { EditUserProfileBox } from './EditUserProfileBox';
import { getSignedUploadUrl } from '../../services/getSignedUploadUrl';
import { uploadFile } from '../../services/uploadFile';
import { getSignedDisplayUrl } from '../../services/getSignedDisplayUrl';
import { auth } from '../../../config/firebase';
import { FollowList } from './FollowList';

export const ProfileHeader = ({ user,isYourProfile ,authenticatedUser,setAuthenticatedUser }) => {
    const inputFileRef = useRef();
    const [profileImage,setProfileImage] = useState(null);
    const [isEditClicked,setIsEditClicked] = useState(false);
    const [name,setName] = useState('');
    const [bio,setBio] = useState('')
    const [oldName,setOldName] = useState();
    const [oldBio,setOldBio] = useState()
    const [loading,setLoading] = useState(false);
    const [isFollowListOpen,setIsFollowListOpen] = useState(false)
    const followListRef = useRef(null)
    const followersMobileRef = useRef(null)
    const followingMobileRef = useRef(null)
    const followersAboveMobileScreenRef = useRef(null)
    const followingAboveMobileScreenRef = useRef(null)
    const [headingOfFollowList,setHeadingOfFollowList] = useState('')
    const [followList,setFollowList] = useState([])
    const [isProfileImageLoading,setIsProfileImageLoading] = useState(true)

    useEffect(() => {
        if(user && isYourProfile) {
                setProfileImage(authenticatedUser.avatar)
                setName(user.name)
                setBio(user.bio)
            }
    },[user,isYourProfile])

    const handleImageChange = async (e) => {
        const imageFile = e.target.files[0];
        if(imageFile) {
            setLoading(true)

            if(!imageFile.type.includes('image'))
                return;

            const { uploadUrl,filePath } = await getSignedUploadUrl(imageFile.type,'profile')

            if(uploadUrl) {
                await uploadFile(imageFile,uploadUrl)
            } else {
                return;
            }
            
            try {
                await api.put(`/api/users/${user._id}`,{
                    avatar : filePath
                })
                await updateProfile(auth.currentUser,{ photoURL : filePath})
                
                const { signedUrl } = await getSignedDisplayUrl(filePath)

                if(signedUrl) {
                    setProfileImage(signedUrl)
                    setAuthenticatedUser((prev) => ({
                        ...prev,
                        avatar : signedUrl
                    }))
                }

            } catch (error) {
                console.log('Failed to update profile image url : '+ error.message)
            } finally {
                setLoading(false)
            }

        }
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }
    const handleBioChange = (e) => {
        setBio(e.target.value)
    }

    const handleImageFileInput = () => {
        inputFileRef.current.click();
    }

    const handleEditClick = () => {
        setOldName(name);
        setOldBio(bio)
        setIsEditClicked(true)
    }

    useEffect(() => {
        const handleClick = (e) => {
            if(followListRef.current && !followListRef.current.contains(e.target) 
                && followersAboveMobileScreenRef.current && !followersAboveMobileScreenRef.current.contains(e.target)
                && followingAboveMobileScreenRef.current && !followingAboveMobileScreenRef.current.contains(e.target)
                && followersMobileRef.current && !followersMobileRef.current.contains(e.target)
                && followingMobileRef.current && !followingMobileRef.current.contains(e.target)
            ) {
                setIsFollowListOpen(false)
            }
        }
        window.addEventListener('click',handleClick)
        return () => {
            window.removeEventListener('click',handleClick)
        }
    },[isFollowListOpen])

    useEffect(() => {
        if(isEditClicked || isFollowListOpen) {
            document.body.style.overflow = 'hidden'
        }
        else
            document.body.style.overflow = 'auto'
    },[isEditClicked,isFollowListOpen])

    if(!user) {
        return (
            <>
                {isYourProfile && (
                    <div className='animate-pulse flex justify-end mt-4 mr-5 md:mr-12 lg:mr-14'>
                        <div className=' px-3 py-2 w-32 h-11 bg-violet-800/30 rounded-xl'></div>
                    </div>
                )}
                <div className='mt-1 sm:hidden animate-pulse p-3'>
                    <div className='flex gap-4'>
                        <div className='relative'>
                            <div className="shrink-0 rounded-full h-20 w-20  bg-violet-800/30"/>
                            {isYourProfile && (
                                <div className='size-7 absolute left-14 top-16 rounded-full p-1 bg-violet-800/30'></div>
                            )}
                        </div>
                        <div className='mt-1'>
                            <div className="bg-violet-800/30 rounded-full h-9 w-48"></div>
                            <div className="mt-3">
                                <div className=' mr-1 w-24 h-5 rounded-full inline-block bg-violet-800/30'></div>
                                <div className='ml-1 mr-1 w-24 h-5 rounded-full inline-block bg-violet-800/30'></div>
                            </div>
                        </div>
                    </div>
                    {!isYourProfile && <div className='bg-violet-800/30 rounded-full h-11 w-full mt-4'></div>}
                    <div className='rounded mt-3 w-full h-48 sm:h-44 md:h-40 bg-violet-800/30'></div>
                </div>
                <div className='px-4 hidden sm:block py-4 animate-pulse'>
                    <div className='w-full flex gap-2 md:gap-3 lg:gap-2 xl:gap-3'>
                        <div className='flex justify-center'>
                            <div className='relative p-2 lg:ml-10 xl:ml-20'>
                                <div className="shrink-0 rounded-full h-24 w-24 md:h-36 md:w-36 bg-violet-800/30" />
                                {isYourProfile && (
                                    <div className='absolute left-16 top-20 md:left-28 md:top-32 rounded-full p-3.5 bg-violet-800/30 hover:bg-violet-700'></div>
                                )}
                            </div>
                        </div>
                        <div className={`${isYourProfile ? "mt-2 md:mt-6" : "md:mt-3"} w-4/5`}>
                            <div className="w-72 h-12 rounded-full bg-violet-800/30"></div>
                            <div className="hidden sm:block mt-2">
                                <div className=' mr-1 w-24 h-5 rounded-full inline-block bg-violet-800/30'></div>
                                <div className='ml-1 mr-1 w-24 h-5 rounded-full inline-block bg-violet-800/30'></div>
                            </div>
                            {!isYourProfile && <div className='p-2 w-32 h-11 rounded-full bg-violet-800/30 mt-3' />}
                        </div>
                    </div>
                    <div className='h-32 md:h-28 lg:h-24 xl:h-16 rounded bg-violet-800/30 mt-3 mx-3 lg:mx-10 xl:mx-20'></div>
                </div>
            </>
        );
    }
    

    return (
        <div className='px-4'>
            {isYourProfile && (
                <div className='flex justify-end mt-4 mr-1 sm:mr-2 md:mr-10 lg:mr-10'>
                    <button 
                        onClick={handleEditClick}
                        className='flex gap-x-2 items-center px-3 py-2 rounded-xl bg-gray-950 border border-fuchsia-400 hover:bg-fuchsia-600/20 active:bg-fuchsia-600/30 text-fuchsia-500'
                    >
                        <svg className='size-5 stoke-white' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        <span>Edit profile</span>
                    </button>
                </div>
            )}

            {/* for mobile screens */}
            <div className='mt-3 sm:hidden'>
                <div className='flex gap-4'>
                    <div className='relative shrink-0'>
                        <div className='relative'>
                            <img 
                                src={profileImage || user.avatar } 
                                alt="User Image" 
                                className="rounded-full h-20 w-20  border border-violet-500/30 text-white object-cover"
                                onLoad={() => setIsProfileImageLoading(false)}
                            />
                            {isProfileImageLoading &&<div className='absolute z-10 inset-0  rounded-full bg-violet-800/30 animate-pulse'></div>}
                        </div>
                        {isYourProfile && (
                            <button
                                onClick={handleImageFileInput}
                                className='size-7 absolute left-14 top-16 rounded-full p-1 bg-violet-900 hover:bg-violet-700'>
                                <input
                                    ref={inputFileRef} 
                                    onChange={handleImageChange}
                                    type='file'
                                    accept='image/*'
                                    className='hidden'
                                />
                                <svg className='stroke-white size-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    
                    <div className='mt-1'>
                        <div className="text-white font-bold text-2xl">{isYourProfile ? name : user.name}</div>
                        <div className="text-gray-300 font-normal text-md mt-2">
                            <span className='text-fuchsia-600 mr-1'>{user.followers?.length}</span>
                            <span ref={followersMobileRef} >
                                <button 
                                    onClick={() => {
                                        setFollowList(user.followers)
                                        setHeadingOfFollowList(isYourProfile ? 'Your followers' : `${user.name}'s followers`)
                                        setIsFollowListOpen(true)
                                    }} 
                                    className='hover:text-violet-300 active:text-violet-500'
                                >
                                    Followers
                                </button>
                            </span>
                            <span className='text-fuchsia-600 ml-3 mr-1'>{user.following?.length}</span>
                            <span ref={followingMobileRef}>
                                <button 
                                    onClick={() => {
                                        setFollowList(user.following)
                                        setHeadingOfFollowList(isYourProfile ? 'You are following' : `${user.name} is following`)
                                        setIsFollowListOpen(true)
                                    }}  
                                    className='hover:text-violet-300 active:text-violet-500'
                                >
                                    Following
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
                {!isYourProfile && <FollowButton followingUserId={user._id} className='p-2 w-full mt-4' />}
                {isYourProfile && bio.length === 0 ? (
                    <div className='mt-4 flex gap-2 items-center'>
                        <span className='text-slate-400'>Describe about yourself</span>
                        <button 
                            onClick={handleEditClick}
                            className='flex gap-x-2 items-center px-5 py-1 rounded-xl bg-gray-950 border border-fuchsia-400 hover:bg-fuchsia-600/20 active:bg-fuchsia-600/30 text-fuchsia-500'
                        >
                            <span>Add bio</span>
                        </button>
                    </div>
                ) : (
                    <div className='text-blue-500 font-normal text-lg tracking-tight mt-3 text-wrap'>{isYourProfile ? bio : user.bio}</div>
                )}
            </div>
            
            {/* for and above small screens */}
            <div className='hidden sm:block py-4'>
                <div className='w-full flex gap-2 md:gap-3 lg:gap-2 xl:gap-3'>
                    <div className='flex justify-center'>
                        <div className='relative shrink-0 p-2 lg:ml-10 xl:ml-20'>
                            {loading ? (
                                <div className='rounded-full h-24 w-24 md:h-36 md:w-36 bg-violet-800/30 animate-pulse'></div>
                            ) : (
                                <div className='relative'>
                                    <img 
                                        src={profileImage || user.avatar} 
                                        alt="User Image" 
                                        className="shrink-0 rounded-full h-24 w-24 md:h-36 md:w-36 border border-violet-500/30 text-white object-cover" 
                                        onLoad={() => setIsProfileImageLoading(false)}
                                    />
                                    {isProfileImageLoading &&<div className='absolute z-10 inset-0  rounded-full bg-violet-800/30 animate-pulse'></div>}
                                </div>
                            )}
                            {isYourProfile && (
                                <button 
                                    onClick={handleImageFileInput}
                                    className='absolute left-16 top-20 md:left-28 md:top-32 rounded-full p-1 bg-violet-900 hover:bg-violet-700'>
                                    <input
                                        ref={inputFileRef} 
                                        onChange={handleImageChange}
                                        type='file'
                                        accept='image/*'
                                        className='hidden'
                                    />
                                    <svg className='stroke-white size-5 md:size-6' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={`${isYourProfile ? "mt-2 md:mt-6" : "md:mt-3"} w-4/5`}>
                        <div className="text-white font-bold text-4xl">{isYourProfile ? name : user.name}</div>
                        <div className="hidden sm:block text-gray-300 font-normal text-md mt-2">
                            <span className='text-fuchsia-600 mr-1'>{user.followers?.length}</span>
                            <span ref={followersAboveMobileScreenRef} >
                                <button 
                                    onClick={() => {
                                        setFollowList(user.followers)
                                        setHeadingOfFollowList(isYourProfile ? 'Your followers' : `${user.name}'s followers`)
                                        setIsFollowListOpen(true)
                                    }}
                                    className='hover:text-violet-300 active:text-violet-500'
                                >
                                    Followers
                                </button>
                            </span>
                            <span className='text-fuchsia-600 ml-3 mr-1'>{user.following?.length}</span>
                            <span ref={followingAboveMobileScreenRef} >
                                <button 
                                    onClick={() => {
                                        setFollowList(user.following)
                                        setHeadingOfFollowList(isYourProfile ? 'You are following' : `${user.name} is following`)
                                        setIsFollowListOpen(true)
                                    }} 
                                    className='hover:text-violet-300 active:text-violet-500'
                                >
                                    Following
                                </button>
                            </span>
                        </div>
                        {!isYourProfile && <FollowButton followingUserId={user._id} className='p-2 w-32 mt-3' loadingClassName='p-2 w-32 mt-3 h-12'/>}
                    </div>
                </div>
                {isYourProfile && bio.length === 0 ? (
                    <div className='mt-4 px-3 lg:px-10 xl:px-20 flex gap-3 items-center'>
                        <span className='text-slate-400'>Describe about yourself</span>
                        <button 
                            onClick={handleEditClick}
                            className='flex gap-x-2 items-center px-5 py-1 rounded-xl bg-gray-950 border border-fuchsia-400 hover:bg-fuchsia-600/20 active:bg-fuchsia-600/30 text-fuchsia-500'
                        >
                            <span>Add bio</span>
                        </button>
                    </div>
                ) : (
                    <div className='w-full text-blue-500 font-normal text-xl tracking-tight mt-3 text-wrap px-3 lg:px-10 xl:px-20'>{isYourProfile ? bio : user.bio}</div>
                )}
            </div>
            
            {isEditClicked && (
                <EditUserProfileBox 
                    name={name} 
                    bio={bio}
                    oldName={oldName}
                    oldBio={oldBio}
                    setName={setName}
                    setBio={setBio}
                    setIsEditClicked={setIsEditClicked}
                    handleNameChange={handleNameChange} 
                    handleBioChange={handleBioChange}
                />
            )}
            {isFollowListOpen && (
                <FollowList ref={followListRef} heading={headingOfFollowList} list={followList} />
            )}
        </div>
    );
} 