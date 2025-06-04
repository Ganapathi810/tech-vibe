import { useEffect,useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../../config/api";

export const FollowButton = ({className,followingUserId,loadingClassName }) => {
    const [follow, setFollow] = useState(false);
    const { user } = useAuth()
    const [loading,setLoading] = useState(true)

    const handleFollow = async () => {
        const previousFollowState = follow;
        try {
            setFollow(!follow)

            let response;

            if(follow)
                response = await api.delete(`/api/users/${followingUserId}/follow`)
            else    
                response = await api.post(`/api/users/${followingUserId}/follow`)
    
            setFollow(response.data.followerUser.following.includes(followingUserId))
    
        } catch (error) {
            setFollow(previousFollowState)
            console.log(`Failed to follow/unfollow the video`,error.message)
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/api/users/${user._id}`)

                setFollow(() => {
                    const followingList = response.data.following
                    const isFollowing = followingList.some(user => user._id === followingUserId)
                    return isFollowing
                })
            } catch (error) {
                console.log(`Failed to get the user to check if followed : `,error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    },[])


    return (
        <>
            {loading ? (
                <div className={`rounded-full ${loadingClassName} bg-violet-800/30 animate-pulse`}></div>
            ) : (
                <button 
                    onClick={handleFollow}
                    className={`${follow 
                        ? 'text-white bg-black border-white' 
                        : 'bg-white text-black'
                    } border-2 border-transparent rounded-full ${className} `}
                >
                    {follow ? "Unfollow" : "Follow"}
                </button>
            )}
        </>
    )
}