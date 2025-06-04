import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidLike,BiSolidDislike,BiSolidCommentDetail  } from "react-icons/bi";
import { RiShareForwardFill } from "react-icons/ri";
import { IoMdPlay,IoIosPause } from "react-icons/io";
import { GoScreenFull } from "react-icons/go";
import { GoScreenNormal } from "react-icons/go";
import { IoVolumeLowSharp,IoVolumeMediumSharp,IoVolumeHighSharp,IoVolumeMuteSharp  } from "react-icons/io5";
import { useAuth } from '../../hooks/useAuth';
import { formatCount } from '../../utils/formatCount';
import { FollowButton } from '../../components/FollowButton';
import api from '../../../config/api';
import { getSignedDisplayUrl } from '../../services/getSignedDisplayUrl';
import  { forwardRef } from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const VideoCard = forwardRef(({video,setVideos,commentClickHandle,videoDescriptionClickHandle,containerRef,isFullScreen,setIsFullScreen,setIsShareBoxOpen,isPlaying,setIsPlaying,isPlayButtonShownOnce,setShowPlayButton,currentIndex },ref) => {
    const { user } = useAuth();
    const [liked,setLiked] =useState(video.likes.includes(user._id));
    const [disliked,setDisliked] =useState(video.dislikes.includes(user._id));
    const [likesCount,setLikesCount] = useState(video.likes.length)
    const [dislikesCount,setDislikesCount] = useState(video.dislikes.length)
    const navigate = useNavigate();
    const [isYourVideo,setIsYourVideo] = useState(false);
    const [showControls,setShowControls] = useState(false);
    const topDivOfControlsRef = useRef();
    const [volume,setVolume] = useState(0.5);
    const [showVolumeSlider,setShowVolumeSlider] = useState(false);
    const [showProgressSliderThumb,setShowProgressSliderThumb] = useState(false);
    const [progress,setProgress] = useState(0);
    const [showProgressBar,setShowProgressBar] = useState(false);
    const [videoUrl,setVideoUrl] = useState()
    const [thumbnailUrl,setThumbnailUrl] = useState(null)
    const [avatar,setAvatar] = useState(video.userId.avatar)
    const videoElementRef = useRef();
    const [showThumbnail,setShowThumbnail] = useState(false)
    const [isVideoLoading,setIsVideoLoading] = useState(true)
    const [hasBeenViewed, setHasBeenViewed] = useState(false);

    const incrementViewCount = useCallback(async () => {
        try {
            setVideos((prevVideos) => {
                return prevVideos.map((prevVideo) => {
                    if(prevVideo._id === video._id) {
                        return { ...prevVideo, views : prevVideo.views + 1}
                    } else {
                        return prevVideo
                    }
                })
            })

            await api.put(`/api/videos/${video._id}/view`);

            setHasBeenViewed(true);
        } catch (error) {
            setVideos((prevVideos) => {
                return prevVideos.map((prevVideo) => {
                    if(prevVideo._id === video._id) {
                        return { ...prevVideo, views : prevVideo.views - 1}
                    } else {
                        return prevVideo
                    }
                })
            })
            console.log("Failed to increment view count"+error.message);
        }
    }, [video._id]);

    useEffect(() => {
        if(ref && videoElementRef.current) {
            ref(videoElementRef.current)
        }
    },[ref])

    useEffect(() => {
        if(video.userId._id === user._id)
            setIsYourVideo(true)
        else
            setIsYourVideo(false)
    },[])

    const handleVideoReaction = async (action) => {
        try {
            setLiked(prev => action === 'like' ? !prev : prev)
            setDisliked(prev => action === 'dislike' ? !prev : prev)
            setLikesCount(prev => (action === 'like' && !liked) ? prev + 1 : prev)
            setDislikesCount(prev => action === 'dislike' ? prev + 1 : prev)

            setVideos((prevVideos) => {
                return prevVideos.map((prevVideo) => {
                    if(prevVideo._id === video._id) {
                        if(action === 'like') {
                            return {
                                ...prevVideo, 
                                likes : liked 
                                    ? prevVideo.likes.filter((userIdWhoLiked) => userIdWhoLiked !== user._id) 
                                    : [...prevVideo.likes,user._id],
                                dislikes : disliked 
                                    ? prevVideo.dislikes.filter((userIdWhoDisiked) => userIdWhoDisiked !== user._id) 
                                    : prevVideo.dislikes
                            }
                        } else if(action === 'dislike') {
                            return {
                                ...prevVideo, 
                                dislikes : disliked 
                                    ? prevVideo.dislikes.filter((userIdWhoDisiked) => userIdWhoDisiked !== user._id) 
                                    : [...prevVideo.dislikes,user._id],
                                likes : liked 
                                    ? prevVideo.likes.filter((userIdWhoLiked) => userIdWhoLiked !== user._id) 
                                    : prevVideo.likes
                            }
                        }
                    } else {
                        return prevVideo
                    }
                })
            })

            const response = await api.put(`/api/videos/${video._id}/reaction`,{
                action 
            })

            setLiked(response.data.likes.includes(user._id))
            setDisliked(response.data.dislikes.includes(user._id))
            setLikesCount(response.data.likes.length)
            setDislikesCount(response.data.dislikes.length)

        } catch (error) {
            console.log(`Failed to ${action} the video`,error.message)
        }
    }

    const likesCountInFormat = useMemo(() => formatCount(likesCount),[likesCount])
    const dislikesCountInFormat = useMemo(() => formatCount(dislikesCount),[dislikesCount])

    const handlePlayAndPause = () => {
        if(!videoUrl) return
        setShowThumbnail(false)
        if(videoElementRef.current?.paused) {
            videoElementRef.current.play()
            setIsPlaying(true)
            setShowProgressBar(false)
        }
        else {
            setShowProgressBar(true)
            videoElementRef.current?.pause()
            setIsPlaying(false)
        }    
    }

    const handleFullScreen = async () => {
        try {
            if(!document.fullscreenElement) {
                await containerRef.current.requestFullscreen()
                setIsFullScreen(true)
            } else {
                document.exitFullscreen();
                setIsFullScreen(false)
            }
        } catch(error) {
            console.log('Failed to be in full screen mode')
        }
    }

    const handleVolumeChange = useCallback((e) => {
        setVolume(e.target.value)
        videoElementRef.current.volume = e.target.value
    },[])


    const handleVolumeClick = () => {
        if(videoElementRef.current.volume > 0) {
            setVolume(0)
            videoElementRef.current.volume = 0;
        } else {
            setVolume(1)
            videoElementRef.current.volume = 1;
        }
    }
    const handleProgressChange = (e) => {
        if(videoElementRef.current && videoElementRef.current.duration) {
            const newTime = (e.target.value / 100) * videoElementRef.current.duration
            // ref.current.fastSeek(newTime)
            videoElementRef.current.currentTime = newTime
            setProgress(e.target.value)
        }
    }

    const handleTimeUpdate = () => {
        if (videoElementRef.current.currentTime >= 3 && !hasBeenViewed) {
            setHasBeenViewed(true)
            incrementViewCount()
        } 
        if(videoElementRef.current) {
            const percentageOfTime = (videoElementRef.current.currentTime / videoElementRef.current.duration) * 100
            setProgress(percentageOfTime)
        }
    }

    useEffect(() => {
        getSignedDisplayUrl(video.thumbnail)
            .then(({ signedUrl }) => {
                if(signedUrl) {
                    setThumbnailUrl(signedUrl)
                }
            })
            .catch((error) => {
                console.log('Failed to get the signed url for thumbnail : '+error.message)
            })

        getSignedDisplayUrl(video.url)
            .then(({ signedUrl }) => {
                if(signedUrl) {
                    setVideoUrl(signedUrl)
                }
            })
            .catch((error) => {
                console.log('Failed to get the signed url for video : '+error.message)
            })

        if(!video.userId.avatar.startsWith('http')) {
            getSignedDisplayUrl(video.userId.avatar)
                .then(({ signedUrl }) => {
                    if(signedUrl) {
                        setAvatar(signedUrl)
                    }
                })
                .catch((error) => {
                    console.log('Failed to get the signed url for profile image in video card : '+error.message)
                })
        }
    },[])

    return (
        <div 
            className={`${isFullScreen ? 'h-[755px] w-[590px]' : 'h-[640px] w-[540px]' } relative p-5 sm:p-0 sm:flex sm:gap-x-1 mt-16`}
        >
            <div className='relative h-full w-full'>
                <img 
                    src={thumbnailUrl}
                    onClick={handlePlayAndPause} 
                    className={`absolute left-0 top-0 h-full w-full max-w-md object-cover rounded-lg ${showThumbnail ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}
                />
                <video
                    onLoadedData={() => {
                        if(currentIndex.current === 0 && !isPlayButtonShownOnce.current) {
                            setShowPlayButton(true)
                            isPlayButtonShownOnce.current = true
                        } 
                        setIsVideoLoading(false)
                        setShowThumbnail(false)
                    }}
                    onWaiting={() => {  
                        if(currentIndex.current === 0) {
                            setShowPlayButton(false)
                        }
                        setIsVideoLoading(true)
                    }}
                    onPlaying={() => setIsVideoLoading(false)}
                    onTimeUpdate={handleTimeUpdate}
                    onClick={handlePlayAndPause} 
                    ref={videoElementRef}
                    src={videoUrl}
                    controls={false}
                    playsInline
                    loop
                    preload='auto'
                    className="h-full w-full max-w-md  rounded-lg"
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={(e) => {
                        if(e.relatedTarget instanceof Node && !topDivOfControlsRef.current?.contains(e.relatedTarget)) {
                            setShowControls(false)
                        }
                    }}
                />
                {isVideoLoading && <div className='absolute z-40 mx-20 my-40 inset-0 flex justify-center items-center '><AiOutlineLoading3Quarters className='h-10 w-10 fill-white animate-spin'/></div>}
            </div>

            {/* video details */}
            <div className="absolute z-20 bottom-9 left-7 sm:left-5  flex flex-col gap-2 w-4/5">
                <div className="flex gap-x-2 items-center">
                    <button
                        onClick={() => navigate(`/profile/${video.userId._id}`)}
                    >
                        <img 
                            src={avatar} 
                            alt='User Profile' 
                            className='w-11 h-11 rounded-full text-white overflow-hidden' 
                        />
                    </button>
                    <button onClick={() => navigate(`/profile/${video.userId._id}`)}>
                        <span className='text-white font-semibold text-base'>
                            {video.userId.name}
                        </span>
                    </button>                
                    {!isYourVideo && <FollowButton followingUserId={video.userId._id} className='px-5 py-1 ml-2' /> }
                </div>
                <div className='text-white text-left line-clamp-1'>
                    {video.title}
                </div>
                <span className='text-blue-300 text-left text-sm line-clamp-2 text-wrap'>{video.description}</span>
            </div>
            
            {/* video progress bar */}
            <div 
                onMouseEnter={() => { 
                    setShowProgressSliderThumb(true)
                    setShowProgressBar(true)
                }} 
                onMouseLeave={() => {
                    setShowProgressBar(false)
                    setShowProgressSliderThumb(false)
                }}
                className={`${isFullScreen ? 'w-[446px]' : 'w-[440px] ' } absolute left-2 bottom-3 sm:left-0 sm:-bottom-2 h-5`}
            >
            {(showProgressBar || !isPlaying) && (
                <input 
                    type='range'
                    min={0}
                    max={100}
                    value={progress}
                    onChange={handleProgressChange} 
                    className={`${showProgressSliderThumb ? null : '[&::-moz-range-thumb]:bg-white/0'} accent:bg-violet-500 bg-transparent cursor-pointer w-full px-4 pr-5 sm:pl-1 sm:pr-0
                    [&::-moz-range-track]:bg-white/70 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-1.5 
                    [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:bg-violet-700
                    [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:bg-violet-700 [&::-moz-range-thumb]:border-none`}
                />)
            }
            </div>

            {/* video controls */}
            {(showControls || !isPlaying) && <div ref={topDivOfControlsRef} className={`${isFullScreen ? 'pr-12' : null} absolute  top-6 left-6 sm:top-4 sm:left-5 w-11/12 sm:w-4/5`}>
                <div className='flex justify-between w-full'>
                    <div className='flex gap-5'>
                        <button  onClick={handlePlayAndPause} className='flex rounded-full bg-black/60 hover:bg-black/70 active:bg-black/80 p-3'>
                            {isPlaying ? <IoIosPause className='h-5 w-5 fill-white'/> : <IoMdPlay className='h-5 w-5 fill-white' />}
                        </button>
                        <div
                            onMouseEnter={() => setShowVolumeSlider(true)} 
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        
                        className='flex gap-2 rounded-full bg-black/60'>
                            <button onClick={handleVolumeClick} className='rounded-full p-3'>
                                { volume <= 0.01 ? (
                                    <IoVolumeMuteSharp className='h-5 w-5 fill-white stroke-white '/>
                                ) : volume < 0.25 ? (
                                    <IoVolumeLowSharp className='h-5 w-5 fill-white stroke-white ' />
                                ) : volume <= 0.6  ? (
                                    <IoVolumeMediumSharp className='h-5 w-5 fill-white stroke-white ' />
                                ) : (
                                    <IoVolumeHighSharp className='h-5 w-5 fill-white stroke-white ' />
                                )}
                            </button>
                            {showVolumeSlider && <input 
                                type='range'
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={handleVolumeChange}
                                className='mr-3 accent:bg-violet-500  bg-transparent cursor-pointer
                                  [&::-moz-range-track]:bg-white [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-1.5 
                                    [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:bg-violet-500
                                    [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:bg-violet-400 [&::-moz-range-thumb]:border-none'
                            />}
                        </div>
                    </div>
                    <div className='mr-3 sm:mr-4'>
                        <button onClick={handleFullScreen} className='rounded-full bg-black/60 hover:bg-black/70 active:bg-black/80 p-3'>
                            {isFullScreen ? <GoScreenNormal className='h-5 w-5 fill-white'/> : <GoScreenFull className='h-5 w-5 fill-white group-hover:fill-violet-200' />}
                        </button>
                    </div>
                </div>
            </div>}  

            {/* side buttons */}
            <div className="absolute right-5 bottom-8 sm:static flex flex-col gap-y-3 items-center justify-end pb-14 ">
                <div className="flex flex-col items-center">
                    <button 
                        onClick={() => handleVideoReaction('like')}
                        className={`${liked ? 'bg-black border-violet-500 hover:bg-violet-500/20' : 'bg-violet-500/60 hover:bg-violet-700' }  border-2 border-transparent rounded-full p-2`}
                    >
                        <BiSolidLike className={`${liked ? 'fill-violet-600' : 'fill-white' } size-7 sm:size-8`}/>
                    </button>
                    <div className="text-white text-base mt-1">{ likesCountInFormat === '' ? 'Like' : likesCountInFormat }</div>
                </div>
                <div className="flex flex-col items-center">
                    <button 
                        onClick={() => handleVideoReaction('dislike')}
                        className={`${disliked ? 'bg-black border-violet-500 hover:bg-violet-500/20' : 'bg-violet-500/60 hover:bg-violet-700' }  border-2 border-transparent rounded-full p-2`}
                    >
                        <BiSolidDislike className={`${disliked ? 'fill-violet-600' : 'fill-white' } size-7 sm:size-8`}/>
                    </button>
                    <div className="text-white text-base mt-1">{ dislikesCountInFormat === '' ? "Dislike" : dislikesCountInFormat }</div>
                </div>
                
                <div className="flex flex-col items-center">
                    <button 
                        onClick={commentClickHandle}
                        className='bg-violet-500/60 hover:bg-violet-700 active:bg-violet-800 rounded-full p-2'
                    >
                        <BiSolidCommentDetail className='fill-white size-7 sm:size-8'/>
                    </button>
                    <div className="text-white text-base mt-1">Comment</div>
                </div>
                
                <div className="flex flex-col items-center">
                    <button onClick={() => setIsShareBoxOpen(true)} className='bg-violet-500/60 hover:bg-violet-700 active:bg-violet-800 rounded-full p-2'>
                        <RiShareForwardFill className='fill-white size-7 sm:size-8'/>
                    </button>
                    <div className="text-white text-base mt-1">Share</div>
                </div>
                
                <div className="flex flex-col items-center">
                    <button 
                        onClick={videoDescriptionClickHandle}
                        className='bg-violet-500/60 hover:bg-violet-700 active:bg-violet-800 rounded-full p-2'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 sm:size-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
});
