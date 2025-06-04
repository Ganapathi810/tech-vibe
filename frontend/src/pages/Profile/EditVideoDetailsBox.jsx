import { useState } from "react";
import api from "../../../config/api";
import { Loading } from "../../components/Loading";

export const EditVideoDetailsBox = ({ id,oldTitle,oldDescription,setIsEditBoxOpen,setVideos }) => {
    const [title,setTitle] = useState(oldTitle);
    const [description,setDescription] = useState(oldDescription);
    const [loading,setLoading] = useState(false)
    
    const handleTitleChange = (e) => setTitle(e.target.value)
    const handleDescriptionChange = (e) => setDescription(e.target.value)
    const handleCancel = () => setIsEditBoxOpen(false)

    const handleSave = async () => {
            try {
                setLoading(true)
                const response = await api.put(`/api/videos/${id}`,{
                    title,
                    description
                })
    
                setVideos((prevVideos) => (
                    prevVideos.map((prevVideo) => (
                        prevVideo._id === id ? { ...prevVideo, title : response.data.title, description : response.data.description} : prevVideo
                    ))
                ))
                
            } catch (error) {
                console.log('Error updating video',error.message)
            }
            finally {
                setLoading(false)
                setIsEditBoxOpen(false);
            }
        }

    return (
        <div style={{ top:(window.scrollY -60 )}} className={`absolute left-0 w-full h-screen bg-black/40 flex items-center justify-center z-50 rounded-2xl`}>
            <div className="bg-gray-950 p-4 h-auto w-full max-w-lg md:w-3/5 rounded-md">
                <div className="text-fuchsia-400 font-semibold text-2xl">Edit Video details</div>
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
                    rows={5}
                    maxLength={200}
                    className="text-white p-2 w-full mt-2 rounded bg-gray-900 border border-violet-400 hover:border-violet-500 outline-none focus:ring-2 focus:ring-violet-600"
                />
                <div className='flex gap-x-3 mt-11 mb-2'>
                    <button 
                        onClick={handleCancel}
                        className='w-full py-2 bg-fuchsia-500 text-white font-semibold rounded-full hover:bg-fuchsia-600 active:bg-fuchsia-700'
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={(title.length == 0 || description.length == 0)}
                        onClick={handleSave}
                        className='w-full py-2 bg-fuchsia-500 text-white font-semibold rounded-full hover:bg-fuchsia-600 active:bg-fuchsia-700'
                    >
                        Save
                    </button>
                </div>
            </div>
            {loading && <Loading loadingMessage={'Editing video details...'} />}
        </div>
    )
}