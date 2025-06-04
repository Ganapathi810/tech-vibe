import { useRef, useState,useMemo,useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "../../hooks/useAuth";
import { formatCount } from "../../utils/formatCount";
import { HiArrowTurnDownRight } from "react-icons/hi2";
import api from "../../../config/api";

export const Comment = ({ videoId,comment,setComments,setRepliesState,setRepliesCountState,setLoadingAddUpdateDeleteComment,setTotalCommentsCount}) => {
    const { user } = useAuth();
    const [liked,setLiked] =useState(comment.likes.includes(user._id));
    const [disliked,setDisliked] =useState(comment.dislikes.includes(user._id));
    const [likesCount,setLikesCount] = useState(comment.likes.length)
    const [dislikesCount,setDislikesCount] = useState(comment.dislikes.length)
    const [repliesCount,setRepliesCount] = useState(comment.replies.length)
    const [reply,setReply] = useState('');
    const [isReplyClicked,setReplyClicked] = useState(false);
    const replyRef = useRef();
    const [showReplies,setShowReplies] = useState(false);
    const [loading,setLoading] =useState(false);
    const [page,setPage] = useState(1);
    const [limit,setLimit] = useState(5);
    const [replies,setReplies] =useState([]);
    const [openCommentOptions,setOpenCommentOptions] = useState(false);
    const [isEditClicked,setIsEditClicked] = useState(false);
    const [editInput,setEditInput] = useState(comment.text);
    const editInputRef = useRef(null);
    const [editedButNotSavedValue,setEditedButNotSavedvalue] = useState(comment.text);
    const [isYourComment,setIsYourComment] = useState(false);
    const commentMenuBoxRef = useRef(null);
    const commentMenuButtonRef = useRef(null);
    const navigate = useNavigate();
    const [loading2,setLoading2] = useState(false);
    const fetchingMoreReplies = useRef(false)

    const hasMoreReplies = replies.length < repliesCount

    useEffect(() => {
        setIsYourComment(comment.userId._id === user._id);
    }, [comment, user]);

    const handleMouseClick = (e) => {
        if(
            commentMenuBoxRef.current && !commentMenuBoxRef.current.contains(e.target) &&
            commentMenuButtonRef.current && e.target !== commentMenuButtonRef.current
        ) {
            setOpenCommentOptions(false);
        }
    }    

    useEffect(() => {
        window.addEventListener('mousedown',handleMouseClick);

        return () => {
            window.removeEventListener('mousedown',handleMouseClick);
        }
    },[openCommentOptions])

    useEffect(() => { 
        if(isEditClicked && editInputRef.current) {
            editInputRef.current.focus();
        }
    },[isEditClicked])

    const handleEditButton = () => {
        setOpenCommentOptions(false);
        setIsEditClicked(!isEditClicked);   
    }

    const handleShowRepliesButtonClick = () => {
        if(replies.length === 0)
            setPage((page) => page + 1)
        setShowReplies(!showReplies)
    }

    useEffect(() => {
        fetchRepliesPerPage(comment._id)
    },[page])

    useEffect(() => {
        if(replyRef.current) replyRef.current.focus();
    },[isReplyClicked])

    const addReply = async (commentId) => {
        try {

            setLoadingAddUpdateDeleteComment(true)

            const postResponse = await api.post(`/api/comments/${videoId}`,{
                userId : user._id,
                text : reply,
                parentCommentId : commentId
            })

            const newReply = {
                ...postResponse.data,
                userId : {
                    _id : user._id,
                    name : user.name,
                    avatar : user.avatar
                }
            }

            const putResponse = await api.put(`/api/comments/${commentId}`,{
                replyId : newReply._id,
                action : 'add'
            })

            if(replies.length < limit) {
                setReplies((prev) => [...prev,newReply])
            }
            
            setRepliesCount(putResponse.data.replies.length)

            if(setRepliesState && setRepliesCountState) {
                if(replies.length < limit) {
                    setRepliesState((prevReplies) => [...prevReplies,newReply])
                }
                setRepliesCountState(putResponse.data.replies.length)
            }
            
        } catch (error) {
            console.log('Failed to add reply/update parent comment : '+error.message);
        } finally {
            setLoadingAddUpdateDeleteComment(false)
        }
    }

    const deleteComment = async (commentId) => {
        try {
            setLoadingAddUpdateDeleteComment(true)

            await api.delete(`/api/comments/${commentId}`)

            if(!comment.parentCommentId) {

                 await api.put(`/api/videos/${videoId}`,{
                    action : 'delete',
                    commentId
                })

               if(setComments && setTotalCommentsCount) {
                    setComments((prevComments) => prevComments.filter((prevComment) => prevComment._id !== commentId))
                    setTotalCommentsCount((c) => c - 1)
                }
            } else {
                await api.put(`/api/comments/${comment.parentCommentId}`,{
                    action : 'delete',
                    replyId : commentId
                })

                if(setRepliesState && setRepliesCountState) {
                    if(replies.length < limit) {
                        setRepliesState((prevReplies) => prevReplies.filter(r => r._id !== commentId))
                    }
                    setRepliesCountState(c =>  c - 1)
                } 
            }
            
        } catch (error) {
            console.log('Failed to delete comment!'+error.message);
        } finally {
            setLoadingAddUpdateDeleteComment(false)
        }
    }

    const fetchRepliesPerPage = async (commentId) => {
        try {
            if(!fetchingMoreReplies.current)
                setLoading(true)
            
            const response = await api.get(`/api/comments/${videoId}/${commentId}/replies?page=${page}&limit=${limit}`)

            if(response.data.repliesPerPage.length === 0) {
                return
            }
            setReplies((prevReplies) => [...prevReplies, ...response.data.repliesPerPage.slice(replies.length % limit)])
        } catch(error) {
            console.log('Failed to fetch replies'+error.message)
        } finally {
            fetchingMoreReplies.current = false
            setLoading(false)
            setLoading2(false);
        }
    }

    const closeReplyBoxHandler =() => {
        setReplyClicked(false)
        setReply('')
    }

    const getTimeElapsedForComment = useMemo(() => {
        let result='';
        const d = new Date(comment.createdAt);
        const currentDate = new Date();
        const years = currentDate.getFullYear() - d.getFullYear();
        if(years)
            result=`${years} years ago`
        else {
            const months = currentDate.getMonth() - d.getMonth();
            if(months)
                result=`${months} months ago`
            else {
                const days = currentDate.getDate() - d.getDate();
                if(days){
                    const weeks = Math.floor(days/7);
                    if(weeks)
                        result=`${weeks} weeks ago`
                    else {
                        result=`${days} days ago`
                    }
                }
                else {
                    const hours = currentDate.getHours() - d.getHours();
                    if(hours)
                        result=`${hours} hours ago`
                    else {
                        const minutes = currentDate.getMinutes() - d.getMinutes();
                        if(minutes)
                            result=`${minutes} minutes ago`
                        else {
                            const seconds = currentDate.getSeconds() - d.getSeconds();
                            result=`${seconds} seconds ago`
                        }
                    }
                }
            }
        }
        return result;
    })


    const likesCountInFormat = useMemo(() => formatCount(likesCount),[likesCount])
    const dislikesCountInFormat = useMemo(() => formatCount(dislikesCount),[dislikesCount])
    const repliesCountInFormat = useMemo(() => formatCount(repliesCount),[repliesCount])

    const updateComment = async (commentId) => {
        try {
            setLoadingAddUpdateDeleteComment(true)
            await api.put(`/api/comments/${commentId}`,{
                text : editedButNotSavedValue
            })
            setIsEditClicked(false);
            setEditInput(editedButNotSavedValue);
            
        } catch (error) {
            console.log('Failed to update comment!',error.message);
        } finally {
            setLoadingAddUpdateDeleteComment(false)
        }
    }

    const handleCommentReaction = async (action) => {
        try {
            const response = await api.put(`/api/comments/${comment._id}/reaction`,{
                userId : user._id,
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

    const handleShowMoreRepliesButton = () => {
        fetchingMoreReplies.current = true
        setLoading2(true);
        if(replies.length < page * limit)
            fetchRepliesPerPage(comment._id)
        else  {
            setPage((page) => page + 1)
        }
    }

    return <div className="p-2">
        <div className="flex gap-x-3 p-2 w-full">
            <div className=" shrink-0">
                <img src={comment.userId.avatar} alt='User Avatar' className={`${comment.parentCommentId ? 'h-8 w-8' : 'h-10 w-10' } rounded-full mt-1 overflow-hidden text-white`}/>
            </div> 
            { isEditClicked ? (
                <div className="w-full pr-2">
                    <div className="flex gap-1  p-3 gap-x-3 ">
                        <input 
                            ref={editInputRef}
                            className="bg-gray-950 text-white outline-none w-full border-b border-gray-700 focus:border-b focus:border-white  p-0"
                            type='text'
                            value={editedButNotSavedValue}
                            onChange={(e) => setEditedButNotSavedvalue(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-x-2 justify-end pb-2 pr-3">
                        <button
                            className="text-white px-4 py-1  rounded-full hover:bg-gray-700"
                            onClick={() => setIsEditClicked(false)}
                        >Cancel</button>
                        {editedButNotSavedValue.length > 0 ? (
                            <button
                                className="text-gray-950 px-4 py-1 bg-blue-500 rounded-full active:bg-blue-700 hover:bg-blue-600"
                                onClick={() => updateComment(comment._id)}
                            >
                                Save
                            </button>
                        ) : (
                            <div
                                className="text-gray-300 px-4 py-1 bg-gray-700 rounded-full"
                            >
                                Save
                            </div>
                        )}
                    </div>
                </div>      
            ) : (
                <div className="flex justify-between w-full">
                    <div className="grow">
                        <div>
                            <button onClick={() => navigate(`/profile/${comment.userId._id}`)} className="flex gap-x-3 items-center">
                                <span className="text-bold text-white">{comment.userId.name}</span>
                                <span className="text-sm text-gray-400 ">{getTimeElapsedForComment}</span>
                            </button>
                            <div className="text-normal text-white text-wrap">
                                {editInput}
                            </div>
                            <div className="flex  items-center gap-2 mt-1">
                                <div className="flex items-center">
                                    <button 
                                        onClick={() => handleCommentReaction('like')}
                                        className={`${liked ? 'border-violet-500 bg-blue-600' : null  }hover:bg-gray-800 rounded-full p-1.5 border-2 border-transparent`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-blue-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                        </svg>
                                    </button> 
                                    <span className="ml-2 text-gray-400 text-sm w-1">{likesCountInFormat}</span>
                                </div>
                                <div className="flex items-center">
                                    <button 
                                        onClick={() => handleCommentReaction('dislike')}
                                        className={`${disliked ? 'border-violet-500 bg-blue-600' : null  }hover:bg-gray-800 rounded-full p-1.5 border-2 border-transparent`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-red-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                                        </svg>
                                    </button>
                                    <span className="ml-2 text-gray-400 text-sm">{dislikesCountInFormat}</span>
                                </div>
                                <button 
                                    onClick={() => setReplyClicked(true)}
                                    className="px-4 py-1 hover:text-gray-white text-sm bg-black text-white hover:bg-blue-500 rounded-full"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                    { isYourComment && <div className="relative">
                        <button
                            ref={commentMenuButtonRef} 
                            onClick={() => setOpenCommentOptions(!openCommentOptions)}
                            className="rounded-full hover:bg-violet-700/40 p-1 mt-5 mr-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </button>
                        { openCommentOptions && (
                            <div 
                                ref={commentMenuBoxRef}
                                className="flex flex-col py-1 absolute top-15 right-7 bg-gray-900 z-50 rounded-md w-24"
                            >
                                <button
                                    onClick={handleEditButton}
                                    className="group flex gap-1 hover:bg-violet-300/20 w-full items-center justify-center pr-3 py-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-white group-hover:stroke-violet-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    <span className="text-white text-sm">Edit</span>
                                </button>
                                <button 
                                    onClick={() => {
                                        deleteComment(comment._id)
                                        setOpenCommentOptions(false)
                                    }}
                                    className=" group flex gap-1 mt-1 items-center hover:bg-violet-300/20 justify-center py-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-white group-hover:stroke-violet-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                    <span className="text-white text-sm">Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                    }
                </div>
            )}
        </div>
        { isReplyClicked && (
            <div className="ml-10 mr-5">
                <div className="z-10 flex gap-1 p-3 gap-x-3">
                    <img src={comment.userId.avatar} alt='User Avatar' className="h-8 w-8 rounded-full"/>
                    <input 
                        ref={replyRef}
                        className="bg-gray-950 text-white outline-none w-full border-b border-gray-700 focus:border-b focus:border-white  p-0"
                        type='text'
                        value={reply}
                        placeholder='Add a reply...'
                        onChange={(e) => setReply(e.target.value)}
                    />
                </div>
                <div className="flex gap-x-2 justify-end pb-2 pr-3">
                    <button
                        className=" text-white px-4 py-1 bg-black rounded-full hover:bg-gray-700"
                        onClick={closeReplyBoxHandler}
                    >Cancel</button>
                    { reply.length > 0 ? (
                        <button
                            className="text-gray-950 px-4 py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-full flex items-center"
                            onClick={() => {
                                addReply(comment._id)
                                closeReplyBoxHandler();
                            }}
                        >
                            Reply
                        </button>
                    ) : (
                        <div
                            className="text-gray-300 px-4 py-1 bg-gray-700 rounded-full"
                        >
                            Reply
                        </div>
                    )}
                </div>
            </div>
        )}
        <div className="ml-14">
            {repliesCount > 0 && (
                <button
                    disabled={loading} 
                    onClick={handleShowRepliesButtonClick}
                    className="flex gap-x-1 w-28 justify-center items-center py-1 hover:bg-violet-400/30 active:bg-violet-400/40 rounded-full"
                >
                    { !showReplies ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className=" pt-1 size-7 stroke-violet-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>    
                    
                    ) : loading ? (
                        <AiOutlineLoading3Quarters className="h-6 w-6 fill-violet-400 animate-spin"/>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="py-1 size-7 stroke-violet-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                    )}
                    { !loading && <span className='text-normal text-violet-500'>{repliesCountInFormat} replies</span>}
                </button>
            )}
        </div>
        <div className="ml-12">
            {showReplies && (
                <div>
                    {replies.map((reply) => (
                        <Comment key={reply._id} videoId={videoId} comment={reply} setRepliesState={setReplies} setRepliesCountState={setRepliesCount} setLoadingAddUpdateDeleteComment={setLoadingAddUpdateDeleteComment}/>
                    ))}
                    {hasMoreReplies && (
                        <button
                            disabled={loading2} 
                            onClick={handleShowMoreRepliesButton}
                            className="ml-4 flex gap-x-1 w-44 h-9  justify-center items-center hover:bg-violet-400/30 active:bg-violet-400/40 rounded-full"
                        >
                            { loading2 ? (
                                <AiOutlineLoading3Quarters className="h-6 w-6 fill-violet-400 animate-spin"/>
                            ) : (
                                <>
                                    <HiArrowTurnDownRight  className="fill-violet-500 h-5 w-5"/>
                                    <span className='text-normal text-violet-500'>Show more replies</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    </div>
}