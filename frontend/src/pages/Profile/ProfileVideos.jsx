import { useEffect, useRef, useState } from "react"
import { CreateBox } from "./CreateBox";
import { EditVideoDetailsBox } from "./EditVideoDetailsBox";
import api from "../../../config/api";
import { ProfileVideoCard } from "./ProfileVideoCard";
import { AiOutlineLoading } from "react-icons/ai";

export const ProfileVideos = ({ user,isYourProfile,showCreateBox,handleCloseCreateBox,setShowCreateBox}) => {
    const [videos,setVideos] = useState([])
    const [loading,setLoading] =useState(true);
    const [oldTitle,setOldTitle] = useState();
    const [oldDescription,setOldDescription] = useState();
    const [videoIdOfClickedVideoMenu,setVideoIdOfClickedVideoMenu] = useState('');
    const [page,setPage] = useState(1)
    const [limit,setLimit] = useState(15)
    const [loadingNextSetOfVideos,setLoadingNextSetOfVideos] = useState(false)
    const noMoreVideos = useRef(false);
    const [isEditBoxOpen,setIsEditBoxOpen] = useState(false)
    const [openMenuVideoId,setOpenMenuVideoId] = useState(null)
    
    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                setLoadingNextSetOfVideos(true)
                await new Promise(resolve => setTimeout(resolve,500))
                const response = await api.get(`/api/videos/users/${user._id}?page=${page}&limit=${limit}`);

                if(response.data.videosPerPage.length === 0 ) {
                    if(page === 1)  
                        setVideos([])
                    else
                        noMoreVideos.current = true
                    setLoadingNextSetOfVideos(false)
                    setLoading(false)
                    return;
                }

                if(page === 1){
                    setVideos(response.data.videosPerPage)
                } else {
                    setVideos((prevVideos) => [...prevVideos,...response.data.videosPerPage])
                }
               
                setLoadingNextSetOfVideos(false)
                setLoading(false)
            } catch (error) {
                console.log('Failed to fetch User videos '+error.message)
            } 
        }
        if(user)
            fetchUserVideos()
    },[user,page])

    useEffect(() => {
        const handleClick = (e) => {
            if(!e.target.closest('.menu-button') && !e.target.closest('.menu-box')) {
                setOpenMenuVideoId(null)
            }
        }
        window.addEventListener('click',handleClick)  
        return () => window.removeEventListener('click',handleClick)  
    },[])


    useEffect(() => {
        const handleScroll = () => {
            if(noMoreVideos.current || loadingNextSetOfVideos) {
                return; 
            }

            if(window.scrollY + window.innerHeight >= document.body.scrollHeight) {
                setPage((prevPage) => prevPage + 1)
            }
        }
        window.addEventListener('scroll',handleScroll)
        
        return () => {
            window.removeEventListener('scroll',handleScroll)
        }
    },[])

    const passVideoInfo = (id,title,description) => {
        setVideoIdOfClickedVideoMenu(id)
        setOldTitle(title)
        setOldDescription(description)
    }

    useEffect(() => {
        if(isEditBoxOpen)
            document.body.style.overflow='hidden'
        else
            document.body.style.overflow='auto'
    },[isEditBoxOpen])

    const handleToggleMenu = (videoId) => {
        setOpenMenuVideoId((prev) => prev == videoId ? null : videoId)
    }

    return (
        <div>
            <div className=' text-purple-500 text-3xl text-center tracking-widest font-semibold mb-4 mt-2 p-3'>Videos</div>
            { loading ? (
                <div className="text-3xl text-black  flex justify-center items-center min-h-screen">
                    <p className="text-2xl font-normal text-slate-400">
                        <span className="inline-block align-middle mr-3 mb-1">
                            <svg className='text-slate-500 h-9 w-9 animate-spin' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill='currentColor' d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>
                        </span>
                        loading...
                    </p>
                </div>
            ) : videos.length > 0 ? (
                <div className="min-h-screen w-full px-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-2">
                        {videos.map((video,index) => (
                            <ProfileVideoCard 
                                key={index} 
                                isMenuOpen={openMenuVideoId === video._id}
                                onToggleMenu={() => handleToggleMenu(video._id)} 
                                video={video}  
                                setVideo={setVideos}
                                setIsEditBoxOpen={setIsEditBoxOpen} 
                                passVideoInfo={passVideoInfo} 
                                isYourProfile={isYourProfile}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-3xl font-normal text-gray-400 flex justify-center items-center min-h-screen">
                    No videos, wanna create?
                    <span className="ml-2">
                        <button onClick={() => setShowCreateBox(true)} className="underline text-violet-500">Click here</button>
                    </span>
                </div>
            )}
            {isEditBoxOpen && (
                <EditVideoDetailsBox 
                    id={videoIdOfClickedVideoMenu} 
                    oldTitle={oldTitle} 
                    oldDescription={oldDescription}
                    setIsEditBoxOpen={setIsEditBoxOpen}
                    setVideos={setVideos}
                />
            )}
            {showCreateBox && (
                <CreateBox handleCloseCreateBox={handleCloseCreateBox} setVideos={setVideos}/>
            )}
            {loadingNextSetOfVideos && <div className="flex justify-center mt-3">
                <AiOutlineLoading className="h-10 w-10 fill-violet-500 animate-spin"/>
            </div>}
        </div>
    );
}