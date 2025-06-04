import { useState } from "react";
import { Loading } from "../../components/Loading";
import { useAuth } from "../../hooks/useAuth";
import api from "../../../config/api";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../config/firebase";

export const EditUserProfileBox = ({ name,bio,oldName,oldBio,setName,setBio,setIsEditClicked,handleNameChange,handleBioChange}) => {
    const [loading,setLoading] = useState(false)
    const { user,setUser } = useAuth()

    const handleCancel = () => {
            setName(oldName);
            setBio(oldBio)
            setIsEditClicked(false)
        }
        const handleSave = async () => {
            try {
                setLoading(true)
                const response = await api.put(`/api/users/${user._id}`,{
                    name,
                    bio
                })
    
                setName(response.data.name);
                setBio(response.data.bio)
                setUser((prevUser) => ({
                    ...prevUser,
                    name : response.data.name
                }))
                await updateProfile(auth.currentUser,{ name : response.data.name})
    
            } catch (error) {
                setName(oldName);
                setBio(oldBio)
                console.log('Error updating user data : ',error.message)
            } finally {
                setLoading(true)
                setIsEditClicked(false);
            }
        }

    return (
        <div className="bg-black/40 absolute left-0 top-0 z-50 h-screen w-full flex items-center justify-center sm:px-10">
            <div className='w-full max-w-3xl flex flex-col gap-y-3 p-5 bg-gray-950 rounded-md'>
                <div className="text-fuchsia-400 font-semibold text-2xl">Edit Your details</div>
                <input
                    type='text'
                    maxLength={60}
                    value={name}
                    placeholder='Name must be at least 3 characters long'
                    onChange={handleNameChange}
                    className='bg-gray-900 focus:ring-2 focus:ring-fuchsia-500 w-full border rounded-xl outline-none hover:border-violet-400  border-violet-700 p-3 mb-2 text-white'
                />
                <textarea 
                    value={bio}
                    placeholder='Bio must be less than or equal to 300 characters'
                    onChange={handleBioChange}
                    rows={5}
                    maxLength={400}
                    className=' bg-gray-900  w-full border focus:ring-2 focus:ring-fuchsia-500 rounded-xl outline-none hover:border-violet-400  border-violet-700 p-3 text-white'
                />
                <div className='flex gap-x-3'>
                    <button 
                        onClick={handleCancel}
                        className='w-28 py-2 bg-fuchsia-500 text-white font-semibold rounded-full hover:bg-fuchsia-600 active:bg-fuchsia-700'
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={(name.length < 3 || bio.length === 0)}
                        onClick={handleSave}
                        className='w-28 py-2 bg-fuchsia-500 text-white font-semibold rounded-full hover:bg-fuchsia-600 active:bg-fuchsia-700'
                    >
                        Save
                    </button>
                </div>
            </div>
            {loading && <Loading loadingMessage={'Editing profile...'} />}
        </div>
        
    );
}