import { useEffect, useRef } from "react";
import { MdEmail } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

export const VideoShareBox = ({ videoShareLink,setIsVideoShareLinkCopied,setIsShareBoxOpen}) => {
    const shareBoxRef = useRef(null);

    const SHARE_PLATFORMS = [
        {
            id : 'whatsapp',
            title : 'WhatsApp',
            icon : <div className='rounded-full bg-green-400 items-center p-2'>
                <FaWhatsapp color='white' className='h-10 w-10 '/>
            </div>,
            handler : () => {
                const text = encodeURIComponent(`Hey, \n\n found this amazing video and thought you'd like it. Check out this video:\n\n${videoShareLink}`)
                const url = `https://wa.me?text=${text}`
                window.open(url,'_blank')  
            },
        },
        {
            id : 'X',
            title : 'X',
            icon : <div className='rounded-full bg-black items-center p-2'>
                <svg className='stroke-white w-10 h-10' xmlns="http://www.w3.org/2000/svg" strokeWidth='2' x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                    <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
                </svg>
            </div>,
            handler : () => {
                const text = encodeURIComponent(`Check out this video:\n\n${videoShareLink}`);
                const url = `https://twitter.com/intent/tweet?text=${text}`
                window.open(url,'_blank')  
            },

        },
        {
            id : 'email',
            title : 'Email',
            icon : <div className='rounded-full bg-gray-500 items-center p-2'>
            <MdEmail color='white' className='h-10 w-10' />
        </div>,
        handler : () => {
            const subject = encodeURIComponent('Check out this video')
            const body = encodeURIComponent(`Hey, \n\n found this amazing video and thought you'd like it:\n\n${videoShareLink}`)
            const url = `mailto:?subject=${subject}&body=${body}`
            window.open(url,'_blank')  
        },
        }
    ]

    const handleCopyLink = async () => {
        try {
            await window.navigator.clipboard.writeText(videoShareLink)
            setIsVideoShareLinkCopied(true)
            setTimeout(() => setIsVideoShareLinkCopied(false),2000)
        } catch (error) {
            console.log('failed to copy video link to clipboard')
        }
    }

    const handleMouseClick = (e) => {
        if(shareBoxRef.current && !shareBoxRef.current.contains(e.target)) {
            setIsShareBoxOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown',handleMouseClick)

        return () => {
            document.removeEventListener('mousedown',handleMouseClick)
        }
    },[])

    return (
        <div className='px-3 sm:px-0 fixed left-0 top-0 z-50 w-screen h-screen flex justify-center items-center bg-black/50'>
            <div ref={shareBoxRef} className='w-[500px] h-[270px] rounded-md bg-slate-900 p-5'>
                <div className='flex justify-between items-center'>
                    <div className='ml-2 text-white text-lg font-semibold'>Share</div>
                    <button
                        className="p-1 hover:bg-violet-500/60 rounded-md active:bg-violet-600/40" 
                        onClick={() => setIsShareBoxOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stroke-white size-7 sm:size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className='flex gap-3 items-center mt-3'>
                    {SHARE_PLATFORMS.map((platform) => {
                        return (
                            <div key={platform.id} className='w-20 h-20'>
                                <div className='flex flex-col items-center'>
                                    <button 
                                        onClick={platform.handler}
                                    >
                                        {platform.icon}
                                    </button>
                                    <div className='text-violet-500 tracking-tight mt-1'>{platform.title}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className='bg-black rounded-xl p-2 mt-6 border border-gray-500/60'>
                    <div className='flex gap-2 items-center p-2 justify-evenly'>
                        <input 
                            value={videoShareLink}
                            onChange={() => {}}
                            className='w-full text-white bg-black text-md tracking-tight'
                        />
                        <button 
                            onClick={handleCopyLink}
                            className='ml-2 bg-violet-600 rounded-full px-4 py-1 text-white hover:bg-violet-700 active:bg-violet-800'>Copy</button>
                    </div>
                </div>
            </div>
        </div>
    )
}