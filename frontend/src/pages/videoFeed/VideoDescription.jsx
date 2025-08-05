import { useMemo } from "react"
import { formatCount } from "../../utils/formatCount"

export const VideoDescription = ({ video,closeDescriptionBoxHandle,isFullScreen,enableScrolling}) => {

    const likesCountInFormat = useMemo(() => formatCount(video.likes.length),[video.likes.length])
    
    return (
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
            className={`${isFullScreen ? 'h-[755px]' : 'h-[550px] xl:h-[600px]'} w-full max-w-lg sm:w-[511px] xl:fixed xl:right-36 xl:top-16 xl:mt-1 flex flex-col border-2 border-violet-500 bg-gray-950 rounded-md`}
        >
            <div className="flex justify-between items-center border-b border-violet-500 p-2">
                <span className="text-white text-xl font-semibold">Description</span>
                <button
                    className="p-1 hover:bg-violet-600/30 rounded-md active:bg-violet-600/40" 
                    onClick={closeDescriptionBoxHandle}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stroke-white  size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="text-fuchsia-400 p-4 text-wrap">{video.description}</div>
            <hr className="mx-4 border-violet-800"></hr>  
            <div className="flex justify-evenly mt-4">
                <div className="flex flex-col items-center">
                    <div className="text-white font-semibold text-2xl">{likesCountInFormat === '' ? '0' : likesCountInFormat}</div>
                    <div className="text-blue-500 text-center">Likes</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-white font-semibold text-2xl">{video.views}</div>
                    <div className="text-blue-500 text-center">Views</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-white font-semibold text-2xl">{new Date(video.createdAt).toLocaleString('default',{ month : 'short'})} {new Date(video.createdAt).getDate()}</div>
                    <div className="text-blue-500 text-center">{new Date(video.createdAt).getFullYear()}</div>
                </div>
            </div>
        </div>
    );
}
