import { useState,useRef, useEffect } from "react";
import { LuUpload } from "react-icons/lu";
import { getSignedUploadUrl } from "../../services/getSignedUploadUrl";
import { uploadFile } from "../../services/uploadFile";
import api from "../../../config/api";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { Loading } from "../../components/Loading";

export const CreateBox = ({ handleCloseCreateBox,setVideos }) => {
    const [videoFile,setVideoFile] = useState();
    const inputFileRef = useRef();
    const inputThumbnailRef = useRef();
    const [isVideoSeleted,setIsVideoSelected] = useState(false);
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [videoUrl,setVideoUrl] = useState()
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const [thumbnailFile,setThumbnailFile] = useState()
    const [thumbnailUrl,setThumbnailUrl] = useState(null)
    const [windowWidth,setWindowWidth] = useState(window.innerWidth)
    const [loadingMessage,setLoadingMessage] = useState('')

    const handleVideoFileChange = async (e) => {
        const videoFile = e.target.files[0];
        
        if(videoFile) {
            if(!videoFile.type.includes('video')) {
                setError('Select only the video file')
                setTimeout(() => setError(null),3000)
                return 
            }
            setVideoFile(videoFile)
            setVideoUrl(URL.createObjectURL(videoFile))
            setIsVideoSelected(true)
        }
    }

    const handleThumbnailFileChange = (e) => {
        const inputFile = e.target.files[0];
        if(inputFile) {
            if(!inputFile.type.includes('image')) {
                setError('Select only the image file')
                setTimeout(() => setError(null),3000)
                return 
            }

            setThumbnailFile(inputFile)
            setThumbnailUrl(URL.createObjectURL(inputFile))
        }
    }

    const handleUpload = async () => {
        try {
            setLoadingMessage('uploading...')
            setLoading(true);
            const { uploadUrl:videoUploadUrl,filePath:videoFilePath,timestamp } = await getSignedUploadUrl(videoFile.type,'video')
            
            const { uploadUrl:thumbnailUploadUrl,filePath:thumbnailFilePath } = await getSignedUploadUrl(thumbnailFile.type,'thumbnail',timestamp)
            
            if(videoUploadUrl && thumbnailUploadUrl) {
                await uploadFile(videoFile,videoUploadUrl)
                await uploadFile(thumbnailFile,thumbnailUploadUrl)
            } else {
                setError('Failed to upload the video')
                setTimeout(() => setError(null),3000)
                return;
            }
        
            const response = await api.post(`/api/videos/`,{
                title ,
                description,
                thumbnail : thumbnailFilePath,
                url : videoFilePath
            })
            setVideos((prevVideos) => ([
                ...prevVideos,
                response.data
            ]))
        } catch (error) {
            console.log('Failed to update profile image url : '+ error.message)
        }
        finally {
            setLoading(false)
            handleCloseCreateBox()
        }
    }

    const handleUploadClick = () => {
        inputFileRef.current.click();
    }
    const handleThumbnailUploadClick = () => {
        inputThumbnailRef.current.click();
    }

    const handleTitleChange = (e) => setTitle(e.target.value)
    const handleDescriptionChange = (e) => setDescription(e.target.value)

    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize',handleResize)

        return () => {
            window.removeEventListener('resize',handleResize)
        }
    },[])

    
    const handleAutoGenerateThumbnail = async (videoFile) => {
        try {
            setLoadingMessage('generating thumbnail...')
            setLoading(true)
            const ffmpeg = new FFmpeg();
            await ffmpeg.load()

            const reader = new FileReader();
            reader.readAsArrayBuffer(videoFile);

            reader.onload = async () => {
                await ffmpeg.writeFile('input.mp4', new Uint8Array(reader.result));

                await ffmpeg.exec(['-i', 'input.mp4', '-frames:v', '1', 'thumbnail.png']);

                const data = await ffmpeg.readFile('thumbnail.png');
                const blob = new Blob([data], { type: 'image/png' });
                setThumbnailFile(blob)

                const url = URL.createObjectURL(blob);
                setThumbnailUrl(url)
                setLoading(false)
            }
        } catch (error) {
            console.log('Failed to auto-generate thumbnail'+error.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div style={{ top : window.scrollY -60 }} className="absolute w-full bg-black/40 h-screen flex justify-center items-center">
            <div className={`${isVideoSeleted ? 'h-auto md:h-[600px] w-full md:w-[750px] lg:w-[900px]' : 'h-[600px] w-[700px]'} flex flex-col bg-gray-900 rounded-2xl relative`}>
                <div className="flex justify-between p-2 items-center border-b border-slate-400/30">
                    <div className="ml-2 text-white font-semibold text-xl">Upload video</div>
                    <button
                        className="p-1 hover:bg-violet-600/30 rounded-md active:bg-violet-600/40" 
                        onClick={handleCloseCreateBox}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stroke-white  size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className={`${isVideoSeleted ? 'justify-start' : 'justify-center'} flex flex-col  items-center grow`}>
                    {!isVideoSeleted ? (
                        <>
                            <button onClick={handleUploadClick} className="rounded-full bg-gray-700 p-5">
                                <input 
                                    ref={inputFileRef}
                                    type='file' 
                                    className="hidden"
                                    accept="video/*"
                                    onChange={handleVideoFileChange}
                                />
                                <LuUpload color='white' className='h-12 w-12'/>
                            </button>
                            <h5 className="text-gray-400 mt-2">Select video file to upload</h5>
                            {error && <div className="text-red-500 mt-5">{error}</div>}
                        </>
                        
                    ) : (
                        <div className={`relative grid grid-cols-1 md:flex md:justify-start gap-2 p-3 h-full w-full`}>
                            {error && <span className="absolute left-0 w-full  mt-5 p-2  text-center"><span className="p-2 rounded bg-red-500 text-white">{error}</span></span>}
                            <div className="flex justify-center h-full md:shrink-0">
                                {!thumbnailUrl ? (
                                    <video 
                                        src={videoUrl}
                                        controls
                                        className="w-[300px] h-full bg-black rounded"
                                    />
                                ) : (
                                    <img src={thumbnailUrl} className="w-[300px] h-full bg-black rounded"/>
                                )}                                             
                            </div>
                            
                            <div className="lg:px-4 grow">
                                <div className="text-fuchsia-500 text-xl md:text-3xl mt-2 lg:mt-0">Enter video details</div>
                                <div className="text-fuchsia-400 font-semibold mt-3">Title :</div>
                                <input 
                                    onChange={handleTitleChange}
                                    value={title}
                                    maxLength={100}
                                    placeholder="Title cannot be empty and should not exceed 100 characters"
                                    className="w-full p-2 text-white outline-none focus:ring-2 focus:ring-violet-600 rounded mt-2 bg-gray-900 border border-violet-400 hover:border-violet-500"
                                />
                                <div className="text-fuchsia-400 mt-2 font-semibold">Description :</div>
                                <textarea 
                                    onChange={handleDescriptionChange}
                                    value={description}
                                    placeholder="Description cannot be empty and should not exceed 200 characters"
                                    rows={windowWidth > 768 ? '5' : '3'}
                                    maxLength={500}
                                    className="text-white p-2 w-full mt-2 rounded bg-gray-900 border border-violet-400 hover:border-violet-500 outline-none focus:ring-2 focus:ring-violet-600"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-fuchsia-300 text-sm md:text-base">You can upload thumbnail image for your video by clicking upload thumbnail or auto-generate it with first frame of the video and preview will be shown.</span>
                                    <div className="flex gap-3">
                                    <button onClick={handleThumbnailUploadClick} className="hover:bg-gray-800 active:bg-gray-900 mt-1 rounded-xl bg-gray-700 p-2">
                                        <input 
                                            ref={inputThumbnailRef}
                                            type='file' 
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleThumbnailFileChange}
                                        />
                                        <span className="text-white">Upload thumbnail</span>
                                    </button>
                                    <button onClick={() => handleAutoGenerateThumbnail(videoFile)} className="hover:bg-gray-800 active:bg-gray-900 mt-1 rounded-xl bg-gray-700 p-2">
                                        <span className="text-white">Auto-generate thumbnail</span>
                                    </button>
                                    </div>
                                </div>
                                <button 
                                    disabled={(title.length == 0 || description.length == 0) || !thumbnailUrl}
                                    onClick={handleUpload}
                                    className='mt-3 md:mt-7 lg:mt-10 w-full py-2 bg-fuchsia-500 text-white font-semibold rounded-full hover:bg-fuchsia-600 active:bg-fuchsia-700'
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {loading && <Loading loadingMessage={loadingMessage} />}
            </div>
        </div>
    )
}