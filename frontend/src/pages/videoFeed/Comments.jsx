import { useEffect, useState,useRef, useMemo, useCallback } from "react";
import { Comment } from './Comment'
import { useAuth } from "../../hooks/useAuth";
import { formatCount } from "../../utils/formatCount";
import api from "../../../config/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const Comments = ({ videoId,closeCommentBoxHandle,isFullScreen}) => {
    const { user } = useAuth()
    const [comment,setComment] = useState('')
    const [isFocused,setIsFocused] = useState(false)
    const [comments,setComments] = useState([]);
    const [totalCommentsCount,setTotalCommentsCount] = useState(0);
    const [page,setPage] = useState(1);
    const [limit,setLimit] = useState(5)
    const [loading,setLoading] = useState(true);
    const [scrollableDiv,setScrollableDiv] = useState(null)
    const [loadingAddUpdateDeleteComment,setLoadingAddUpdateDeleteComment] = useState(false)
    const [isNewestFirstEnable,setIsNewestFirstEnable] = useState(false)
    const isScrollingLocked = useRef(false)
    const [hasMoreComments,setHasMoreComments] = useState(false)

    const newestFirstButtonHandle = async () => {
        try {
            if(page === 1) {
                setComments([])
            }
            setLoading(true)
            const response = await api.get(`/api/comments/${videoId}?page=${page}&limit=${limit}&sort=latest`)

            const fetchedComments = response.data.commentsPerPage
             setHasMoreComments(fetchedComments.length === limit && totalCommentsCount > page * limit)
            
            if(response.data.commentsPerPage.length === 0) {
                return
            }

            setComments((prevComments) => [...prevComments,...response.data.commentsPerPage])

        } catch(error) {
            console.log('Failed to fetch latest comments'+error.message)
        } finally {
            setLoading(false)
        }
    }


    const closeHandler = () =>{
        setIsFocused(false)
        setComment('')
    }

    const addComment = async () => {
        closeHandler();
        
        try {
            setLoadingAddUpdateDeleteComment(true)
            const postResponse = await api.post(`/api/comments/${videoId}`,{
                userId : user._id,
                text : comment,
            })

            const newComment = {
                ...postResponse.data,
                userId : {
                    _id : user._id,
                    name : user.name,
                    avatar : user.avatar
                }
            }
            const putResponse = await api.put(`/api/videos/${videoId}`,{
                commentId : newComment._id,
                action : 'add'
            })

            if(comments.length < limit || isNewestFirstEnable) {
                if(isNewestFirstEnable) {
                    setComments((prevComments) => [newComment,...prevComments])
                } else {
                    setComments((prevComments) => [...prevComments,newComment])
                }
            }
            setTotalCommentsCount(putResponse.data.comments.length)
            setHasMoreComments(true)

        } catch(error) {
            console.log('Failed to add comment '+error.message)
        } finally {
            setLoadingAddUpdateDeleteComment(false)
        }
    }

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/api/videos/${videoId}`)
                setTotalCommentsCount(response.data.comments.length)
    
            } catch(error) {
                console.log('Failed to fetch the video : '+error.message)
                setLoading(false);
            }
        }
        fetchVideo()
    },[videoId])

    const scrollableRef = useCallback((node) => {
        setScrollableDiv(node)
    },[])

    useEffect(() => {
        if(!scrollableDiv) return

        const handleScroll = () => {
            if(loading || !hasMoreComments || isScrollingLocked.current) return;

            const commentBox = scrollableDiv;
            const isBottomReached = commentBox.scrollTop + commentBox.clientHeight >= commentBox.scrollHeight - 4 // 4 is just a buffer value

            if(isBottomReached) {
                isScrollingLocked.current = true

                if(comments.length < page * limit)
                    fetchComments()
                else if(totalCommentsCount >= page * limit)
                    setPage((prev) => prev + 1)
            }
            isScrollingLocked.current = false
        }

        scrollableDiv.addEventListener('scroll',handleScroll)

        return () => {
            scrollableDiv.removeEventListener('scroll',handleScroll)
        }
    },[scrollableDiv,hasMoreComments,loading,isNewestFirstEnable,totalCommentsCount])

    const fetchComments = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/api/comments/${videoId}?page=${page}&limit=${limit}`)

            const fetchedComments = response.data.commentsPerPage

            setHasMoreComments(fetchedComments.length === limit)
            
            if(response.data.commentsPerPage.length === 0) {
                return;
            }

            setComments((prevComments) => {
                if(page === 1)
                    return [...response.data.commentsPerPage]
                else
                    return [...prevComments,...response.data.commentsPerPage.slice(comments.length % limit)]
            })

        } catch(error) {
            console.log('Failed to fetch comments : '+error.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setComments([])
        setPage(1)
    },[videoId])

    useEffect(() => {
        if(isNewestFirstEnable) {
            newestFirstButtonHandle()
        } else {
            fetchComments();
        }
    },[videoId,page,isNewestFirstEnable])

     const totalCommentsCountInFormat = useMemo(() => formatCount(totalCommentsCount),[totalCommentsCount])


    return (
        <div className={`${isFullScreen ? 'h-[755px]' : 'h-[560px] xl:h-[600px]' } relative flex flex-col justify-between w-full sm:w-[511px] border-2 border-violet-500 rounded-md bg-gray-950`}>
            <div className="flex justify-between border-b border-violet-500 p-2">
                <div className="flex gap-x-3 items-center">
                    <span className="text-white text-xl font-semibold">Comments</span>
                    <span className="text-gray-400 text-lg pt-1">{totalCommentsCountInFormat}</span>
                </div>
                <div className="flex items-center gap-x-2">
                    <button
                        className={`${isNewestFirstEnable ? 'bg-violet-700/50' : ''} text-white text-semibold p-2 hover:bg-violet-600/30 rounded-md active:bg-violet-600/40`}
                        onClick={() => {
                            setIsNewestFirstEnable(!isNewestFirstEnable)
                            setPage(1)
                        }}
                    >
                        <span className="tracking-tight">Newest first</span> 
                   </button>
                    <button
                        className="p-1 hover:bg-violet-600/30 rounded-md active:bg-violet-600/40" 
                        onClick={closeCommentBoxHandle}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stroke-white  size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            {!loading && comments.length === 0 ? (
                <div className="flex justify-center">
                    <span className="text-gray-500 text-md font-medium">No comments</span>
                </div>
            ) : loading && page === 1 ? (
                <div className="flex justify-center">
                    <div className="h-10 w-10 rounded-full border-t-4 border-t-violet-400 animate-spin"></div>
                </div>
            ) : (
                <div ref={scrollableRef} className="grow overflow-y-auto flex flex-col justify-start">
                    {
                        comments?.map((comment) => (
                            <Comment 
                                key={comment._id} 
                                videoId={videoId} 
                                comment={comment} 
                                setComments={setComments} 
                                setLoadingAddUpdateDeleteComment={setLoadingAddUpdateDeleteComment} 
                                setTotalCommentsCount={setTotalCommentsCount}
                            />
                        ))
                    }
                    {loading && <div className="flex justify-center p-2">
                        <div className="animate-spin h-10 w-10 border-4 border-white border-dashed rounded-full text-slate-400"></div>
                    </div>
                    }
                </div>
            )}
            {loadingAddUpdateDeleteComment && <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                <AiOutlineLoading3Quarters className="size-7 fill-violet-500 animate-spin"/>
            </div>}
            <div>
                <div className="flex gap-1 border-t border-violet-500 p-3 gap-x-3">
                    <img src={user.avatar} alt='User Avatar' className="h-11 w-11 rounded-full"/>
                    <input 
                        onFocus={() => setIsFocused(true)}
                        className="bg-gray-950 text-white outline-none w-full border-b border-gray-700 focus:border-b focus:border-white  p-0"
                        type='text'
                        value={comment}
                        placeholder='Add a comment...'
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                { isFocused && (
                    <div className="flex gap-x-2 justify-end pb-2 pr-3">
                        <button
                            className=" text-white px-4 py-1 bg-black rounded-full hover:bg-gray-700"
                            onClick={closeHandler}
                        >Cancel</button>
                        { comment.length > 0 ? (
                            <button
                                className="text-gray-950 px-4 py-1 bg-blue-600 rounded-full active:bg-cyan-700 hover:bg-cyan-500"
                                onClick={addComment}
                            >
                                Comment
                            </button>
                        ) : (
                            <div
                                className="text-gray-300 px-4 py-1 bg-gray-700 rounded-full"
                            >
                                Comment
                            </div>
                        )}
                    </div>      
                )}
            </div>        
        </div>
    );
    
}
