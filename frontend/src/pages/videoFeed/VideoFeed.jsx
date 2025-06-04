import { useEffect, useState, useRef } from "react"
import { VideoCard } from "./VideoCard"
import { Comments } from './Comments'
import { useAuth } from "../../hooks/useAuth"
import { VideoDescription } from "./VideoDescription"
import { AiOutlineLoading } from "react-icons/ai";
import api from "../../../config/api"
import { useNavigate, useParams } from "react-router-dom"
import { useAnimate,motion } from 'motion/react'
import { VideoFeedSkeletonLoader } from "./VideoFeedSkeletonLoader"
import { VideoShareBox } from "./VideoShareBox"
import { IoMdPlay } from "react-icons/io";

export const VideoFeed = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [limit,setLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isCommentClicked,setIsCommentClicked] = useState(false);
    const containerRef = useRef(null);
    const [isDescriptionClicked,setIsDescriptionClicked] = useState(false);
    const [isFullScreen,setIsFullScreen] = useState(false)
    const [windowWidth,setWindowWidth] = useState(window.innerWidth)
    const { videoId } = useParams();  // videoId from current url
    const [scope,animate] = useAnimate()
    const navigate = useNavigate();
    const currentIndex = useRef(0);
    const isAnimating = useRef(false)
    const scrollLoading = useRef(false);
    const pendingScrollIndex = useRef(null);
    const isInternalNavigation = useRef(false);
    const [noMoreVideos,setNoMoreVideos]= useState(false);
    const enableScrolling = useRef(true);
    const [videoShareLink,setVideoShareLink] = useState(window.location.href);
    const [isVideoShareLinkCopied,setIsVideoShareLinkCopied] = useState(false);
    const [isShareBoxOpen,setIsShareBoxOpen] = useState(false);
    const videoRefs = useRef({})
    const [isPlaying,setIsPlaying] = useState(false);
    const [hasUserInteracted,setHasUserInteracted] = useState(false)
    const hasUserInteractedRef= useRef(false)
    const [showPlayButton,setShowPlayButton] = useState(false)
    const isPlayButtonShownOnce = useRef(false)
    const touchStartY = useRef(null);
    const touchEndY = useRef(null);
    const firstVideoId = useRef(null)


     useEffect(() => {
        if(isShareBoxOpen)
            enableScrolling.current = false
        else
            enableScrolling.current = true
    },[isShareBoxOpen])

    const fetchVideos = async (pageNum) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/videos?page=${pageNum}&limit=${limit}&firstVideoId=${firstVideoId.current}`);

            if(!response)
                return

            if(response.data.videosPerPage.length === 0) {
                setNoMoreVideos(true);
                setTimeout(() => setNoMoreVideos(false),1500)
                setLoading(false);
                scrollLoading.current = false;
                isAnimating.current = false;
                return;
            } 

            if(videos.length === 0) {
                const fetchedVideos = response.data.videosPerPage;
                setVideos(fetchedVideos);
                return;
            }
            setVideos(prevVideos => [...prevVideos, ...response.data.videosPerPage]);

            if(scrollLoading.current === true) {
                scrollLoading.current = false
                const nextIndex = currentIndex.current + 1
                pendingScrollIndex.current = nextIndex
            }

        } catch (error) {
            console.log("Error fetching videos"+error.message);
        } finally {
            setLoading(false);
            scrollLoading.current = false
        }
    };

    useEffect(() => {
        const pendingScrollToNextVideo = async () => {
            if(pendingScrollIndex.current !== null && videos.length > pendingScrollIndex.current) {
                await triggerScroll(pendingScrollIndex.current)
                pendingScrollIndex.current = null
            }
        }
        pendingScrollToNextVideo()

    },[videos])



    useEffect(() => {
        if(page === 1) {
            firstVideoId.current = videoId
            fetchVideos(page)
        }
        else if(page > 1)
            fetchVideos(page);
    }, [page]);

    const commentClickHandle = () => {
        if(window.innerWidth >= 1280) 
            enableScrolling.current = true
        else
             enableScrolling.current = false

        if(isDescriptionClicked)
            setIsDescriptionClicked(false)
        setIsCommentClicked(!isCommentClicked);
    }

    const videoDescriptionClickHandle = () => {
         if(window.innerWidth >= 1280) 
            enableScrolling.current = true
        else
             enableScrolling.current = false

        if(isCommentClicked)
            setIsCommentClicked(false)
        setIsDescriptionClicked(!isDescriptionClicked)   
    }

    const closeCommentBoxHandle = () => {
        enableScrolling.current = true
        setIsCommentClicked(false);
    }

    const closeDescriptionBoxHandle = () => {
        enableScrolling.current = true
        setIsDescriptionClicked(false);
    }

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize',handleResize)

        return () => {
            window.removeEventListener('resize',handleResize)
        }
    },[])

    useEffect(() => {
        hasUserInteractedRef.current = hasUserInteracted
    },[hasUserInteracted])

    const triggerScroll = async (nextIndex) => {
        currentIndex.current = nextIndex
        try {
            await new Promise((resolve) => 
                requestAnimationFrame(() => requestAnimationFrame(resolve)
            ));
  
            await animate(scope.current, {
                y: `-${nextIndex * 100}vh`,
            }, {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
            })
            isInternalNavigation.current = true;
            navigate(`/clips/${videos[nextIndex]._id}`,{ replace : true })
            
            const currentVideoId = videos[nextIndex]._id;
            
            //pause all videos first
            Object.values(videoRefs.current).forEach(async (videoEl) => {
                if (videoEl && !videoEl.paused) {
                    try {
                        await videoEl.pause();
                    } catch (e) {
                        console.error("Video pause failed", e);
                    }
                }
            });
            
            const currentVideoEl = videoRefs.current[currentVideoId];
            
            if (currentVideoEl) {
                try {
                    if(hasUserInteractedRef.current) {
                        currentVideoEl.muted = false; 
                        currentVideoEl.currentTime = 0.1
                        currentVideoEl.play()
                            .then(() => setIsPlaying(true))
                            .catch((e) => console.error("Video play failed:", e));    
                    }
                } catch (e) {
                    console.error("Video play failed :", e);
                }
            }
            isAnimating.current = false;
            setVideoShareLink(window.location.href)
        } catch (err) {
            isAnimating.current = false
        }
    }

    useEffect(() => {
        if(hasUserInteracted && currentIndex.current === 0) {
            const currentVideoId = videos[currentIndex.current]._id

            const currentVideoEl = videoRefs.current[currentVideoId];

            currentVideoEl.muted = false;
            currentVideoEl.play()
                .then(() => console.log('video is playing'))
                .catch((error) => console.log('failed to play : ',error))
            setIsPlaying(true)  
        }
    },[hasUserInteracted])
        
    useEffect(() => {
        const handleScroll = async (e) => {
            if (isAnimating.current || scrollLoading.current || noMoreVideos || videos.length === 0 || !enableScrolling.current || !hasUserInteracted) {
                return;  
            } 

            const delta = e.deltaY
            const videoIndex = currentIndex.current
            isAnimating.current = true;

            if (delta > 30 && videoIndex < videos.length - 1) {
                await triggerScroll(videoIndex + 1)
            } else if (delta < -30 && videoIndex > 0) {
                await triggerScroll(videoIndex - 1)
            } else if (delta > 30 && videoIndex === videos.length - 1 && !scrollLoading.current) {
                scrollLoading.current = true
                setPage((prevPage) => prevPage + 1)
            } else {
                isAnimating.current = false;
            }
        }

        window.addEventListener('wheel', handleScroll,{ passive : false })
        return () => window.removeEventListener('wheel', handleScroll)
    }, [videos,isCommentClicked,hasUserInteracted,noMoreVideos])

    useEffect(() => {
        const handleTouchStart = (e) => {
            touchStartY.current = e.touches[0].clientY;
            touchEndY.current = null
        };

        const handleTouchMove = (e) => {
            touchEndY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = async () => {
            
            if(touchEndY.current === null) {
                return;
            }

            if (
                isAnimating.current || 
                scrollLoading.current || 
                noMoreVideos || 
                videos.length === 0 || 
                !enableScrolling.current || 
                !hasUserInteracted
            ) return;

            const deltaY = touchStartY.current - touchEndY.current;

            if (deltaY > 110 && currentIndex.current < videos.length - 1) {
                isAnimating.current = true;
                await triggerScroll(currentIndex.current + 1);
            } else if (deltaY < -90 && currentIndex.current > 0) {
                isAnimating.current = true;
                await triggerScroll(currentIndex.current - 1);
            } else if (deltaY > 30 && currentIndex.current === videos.length - 1 && !scrollLoading.current) {
                scrollLoading.current = true;
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [videos, hasUserInteracted]);


    return (
        <div 
            ref={containerRef} 
            className="relative h-screen bg-gray-950 overflow-hidden"
        >
            {loading && videos.length === 0 ? (
                <VideoFeedSkeletonLoader />
            ) : (
                <>
                    <motion.div 
                        ref={scope}
                        className="relative"
                    >
                        {videos.map((video) => ( 
                            <div
                                key={video._id}
                                className={`${isCommentClicked || isDescriptionClicked ? 'flex justify-evenly' : 'flex justify-center'} h-screen pb-3`}
                            >
                                <VideoCard
                                    ref={(el) => {
                                        if(el && video._id) 
                                            videoRefs.current[video._id] = el
                                    }}
                                    isPlayButtonShownOnce={isPlayButtonShownOnce}
                                    setShowPlayButton={setShowPlayButton}
                                    currentIndex={currentIndex}
                                    containerRef={containerRef}
                                    video={video} 
                                    setVideos={setVideos}
                                    commentClickHandle={commentClickHandle}
                                    videoDescriptionClickHandle={videoDescriptionClickHandle}
                                    isFullScreen={isFullScreen}
                                    setIsFullScreen={setIsFullScreen}
                                    setIsShareBoxOpen={setIsShareBoxOpen}
                                    isPlaying={isPlaying}
                                    setIsPlaying={setIsPlaying}
                                />
                                {(isCommentClicked || isDescriptionClicked) && (
                                    <div className="hidden xl:block xl:w-1/3 xl:opacity-0"></div>
                                )}
                            </div>
                        ))}
                        {scrollLoading.current && <div className="absolute left-0 bottom-0 flex h-screen w-screen justify-center items-center sm:bottom-3 sm:left-7  sm:justify-start sm:items-end pb-6">
                            <AiOutlineLoading  className="h-9 w-9 fill-violet-700 animate-spin"/>
                        </div>}
                        {noMoreVideos && <div className="absolute left-0 bottom-0 flex h-screen w-screen justify-center items-center sm:justify-start sm:items-end">
                                <div className=" bg-white rounded-lg text-violet-900 p-2 sm:mb-5 sm:ml-4">No more videos.</div>
                        </div>}
                    </motion.div>

                    {(isDescriptionClicked || isCommentClicked) && (
                        <div 
                            className="fixed z-40 left-0 top-0 h-screen w-screen xl:left-auto xl:right-0 xl:w-1/3 flex items-center justify-center pt-16 p-2"
                        >
                            {isDescriptionClicked && <VideoDescription video={videos[currentIndex.current]} closeDescriptionBoxHandle={closeDescriptionBoxHandle} isFullScreen={isFullScreen} enableScrolling={enableScrolling}/>}
                            {isCommentClicked && 
                                <div
                                    onMouseEnter={() => {
                                        enableScrolling.current = false
                                    }}
                                    onMouseLeave={() => {
                                        if(window.innerWidth >= 1280)
                                            enableScrolling.current = true
                                        else
                                            enableScrolling.current = false
                                    }}
                                    className="xl:fixed xl:right-36 xl:top-16 mt-1 pb-9 w-full max-w-lg"
                                >
                                    {isCommentClicked && (
                                        <Comments videoId={videoId} closeCommentBoxHandle={closeCommentBoxHandle} isFullScreen={isFullScreen}/>
                                    )}
                                </div>
                            }
                        </div>
                    )}
                    {isShareBoxOpen && (
                        <VideoShareBox
                            videoShareLink={videoShareLink}
                            setIsVideoShareLinkCopied={setIsVideoShareLinkCopied}   
                            setIsShareBoxOpen={setIsShareBoxOpen}      
                        />
                    )}
                    {showPlayButton && <div className="h-[90vh] mt-14 w-screen flex items-center justify-center absolute z-40 top-0 left-0 ">
                        <button onClick={() => {
                            setShowPlayButton(false)
                            setHasUserInteracted(true)
                        }} className="rounded-3xl bg-gradient-to-r from-pink-500/80 hover:from-pink-600 to-blue-500/80 hover:to-blue-600 px-8 py-4 sm:mr-20">
                            <IoMdPlay className='h-6 w-6 fill-white' />
                        </button>
                        </div>}
                    {isVideoShareLinkCopied && <div className='fixed z-50 bottom-16 left-16 bg-white text-black p-2 rounded-md'>Video share link is copied to clipboard!</div>}
                </>
            )}
        </div>
    );
}



