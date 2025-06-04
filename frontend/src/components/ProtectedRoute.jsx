import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthStateChanged } from "../hooks/useAuthStateChanged";
import { TopBar } from "./Topbar";

export const ProtectedRoute = () => {
    const { user } = useAuth();
    const loading = useAuthStateChanged();
    
    return <div>
        {loading ? (
            <div className='h-screen flex justify-center items-center bg-gray-950'>
                <span className='text-violet-400 text-3xl'>loading...</span>
            </div>
        ) : user ? (
            <div>
                <TopBar />
                <Outlet />
            </div>
        ) : (
            <Navigate to='/signin' />
        )}
    </div>
}