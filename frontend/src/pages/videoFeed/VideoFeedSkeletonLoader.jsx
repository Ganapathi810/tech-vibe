export const VideoFeedSkeletonLoader = () => {
    return (
        <div className="h-screen animate-pulse flex items-center justify-center pt-14">
            <div className='h-[640px] w-[540px] relative p-5 sm:p-0 sm:flex sm:gap-x-1'>
                <div className="h-full w-full max-w-md rounded-lg bg-violet-800/30" />
                <div className="ml-1 absolute right-8 bottom-8 sm:static flex flex-col gap-y-3 items-center justify-end pb-16 sm:pb-8">
                    <div className="flex flex-col items-center">
                        <button className='bg-violet-800/30  rounded-full p-6 sm:p-7'></button>
                        <div className="bg-violet-800/30 h-4 sm:h-5 w-12 rounded-full mt-2"></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <button className='bg-violet-800/30   rounded-full p-6 sm:p-7'></button>
                        <div className="bg-violet-800/30 h-4 sm:h-5 w-12 rounded-full  mt-2"></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <button className='bg-violet-800/30   rounded-full p-6 sm:p-7'></button>
                        <div className="bg-violet-800/30 h-4 sm:h-5 w-12 rounded-full mt-2"></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <button className='bg-violet-800/30   rounded-full p-6 sm:p-7'></button>
                        <div className="bg-violet-800/30 h-4 sm:h-5 w-12 rounded-full mt-2"></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <button className='bg-violet-800/30   rounded-full p-6 sm:p-7'></button>
                    </div>
                </div>
            </div>
        </div>
    );
}