import { useEffect, useState } from "react"
import { getSignedDisplayUrl } from "../../services/getSignedDisplayUrl"
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { Loading } from "../../components/Loading";

export const ProfileVideoCard = ({ video,setIsEditBoxOpen,isYourProfile,passVideoInfo,isMenuOpen,onToggleMenu,setVideos}) => {
    const [thumbnailUrl,setThubnailUrl] = useState();
    const navigate = useNavigate()
    const [isImageLoading,setIsImageLoading] = useState(true)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        getSignedDisplayUrl(video.thumbnail)
            .then(({ signedUrl }) => {
                if(signedUrl) {
                    setThubnailUrl(signedUrl)
                }
            })
            .catch((error) => {
                console.log('Failed to get the signed url for thumbnail : '+error.message)
            })
    },[])

    const handleEditClick = () => {
        onToggleMenu()
        setIsEditBoxOpen(true)
    }

    const handleDeleteClick = async () => {
        try {
            setLoading(true)
            const videoTimeStamp = video.url.match(/\/(\d+)_video\.mp4$/)[1] // [ 122222_video.mp4,122222] => example array returned by match

            await api.delete(`/api/videos/${video._id}?videoTimeStamp=${videoTimeStamp}`)

            setVideos((prevVideos) => {
                return prevVideos.filter((prevVideo) => prevVideo._id !== video._id)
            })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log('Failed to delete video : '+error.message)
        }
    }


    return (
        <div className="relative flex flex-col items-center">
            <button onClick={() => navigate(`/clips/${video._id}`,{ replace : true })}>
                <img 
                    src={thumbnailUrl} 
                    className={`${isImageLoading ? 'opacity-0' : 'opacity-100'} h-96 w-72 rounded-lg`} 
                    onLoad={() => setIsImageLoading(false)}
                />
                {isImageLoading && <div className='bg-violet-400/20 animate-pulse absolute inset-0 '></div>}
            </button>
            <div>
                <div className="flex justify-between">
                    <div className="text-xl text-white text-wrap w-60 mt-1 text-left line-clamp-2 tracking-tighter">{video.title}</div>
                    {isYourProfile && (
                        <button 
                            onClick={() => {
                                onToggleMenu()
                                passVideoInfo(video._id,video.title,video.description)
                            }}
                            
                            className="menu-button rounded-full hover:bg-violet-500/30 h-8 w-8 flex items-center justify-center mr-0.5 mt-1"
                        >
                            <svg className="size-6 stroke-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="font-normal text-blue-400 mt-0.5">{video.views} Views</div>
            </div>
            {isMenuOpen && (
                <div 
                    className="menu-box absolute bottom-16 right-3 flex flex-col py-1 bg-gray-900 z-50 rounded-md w-24"
                >
                    <button
                        onClick={handleEditClick}
                        className="group flex gap-1 hover:bg-violet-300/20 w-full items-center justify-center pr-3 py-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-white group-hover:stroke-violet-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        <span className="text-white text-sm">Edit</span>
                    </button>
                    <button 
                        onClick={() => {
                            handleDeleteClick()
                            onToggleMenu()
                        }}
                        className="group flex gap-1 mt-1 items-center hover:bg-violet-300/20 justify-center py-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-white group-hover:stroke-violet-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        <span className="text-white text-sm">Delete</span>
                    </button>
                </div>
            )}
            {loading && <Loading loadingMessage={'deleting video...'}/>}
        </div>
    )
}