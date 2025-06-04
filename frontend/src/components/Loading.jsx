import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const Loading = ({ loadingMessage }) => {
    return (
        <div className="absolute z-50 inset-0 bg-black/60  flex gap-3 justify-center items-center">
            <AiOutlineLoading3Quarters className="size-7 fill-white animate-spin"/>
            <span className="text-white text-lg">{loadingMessage}</span>
        </div>
    )
}