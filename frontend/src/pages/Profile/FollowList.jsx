import { forwardRef } from "react"
import { FollowButton } from "../../components/FollowButton"
import { useAuth } from "../../hooks/useAuth"

export const FollowList = forwardRef(({heading, list },ref) => {
    const { user } = useAuth();

    return (
        <div  className="absolute z-50 left-0 top-0 h-screen w-full flex items-center justify-center">
            <div ref={ref} className="flex flex-col w-[80vw] h-[50vh] sm:w-[60vh] border border-violet-300/30 rounded-xl bg-gray-950 p-2">
                <div className="text-violet-500 text-xl font-semibold w-full text-center p-2">{heading}</div>
                    {list.length === 0 ? (
                        <div className="flex flex-col flex-grow items-center justify-center text-white">{heading.includes('follower') ? 'no followers' : 'Not following anyone'}</div>
                    ) : (
                        <div className="p-3  overflow-y-scroll">
                            {list.map((item) => (
                                <div key={item._id} className="flex justify-between p-2">
                                    <div className="flex gap-3 items-center">
                                        <img src={item.avatar} alt='user avatar' className="rounded-full size-10"/>
                                        <div className="text-white font-semibold">{user.name === item.name ? 'You' : `${item.name}`}</div>
                                    </div>
                                    {user.name !== item.name &&<FollowButton className={'px-4 py-1'} followingUserId={item._id} loadingClassName='h-10 w-20'/>}
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </div>
        
    )
})