import axios from 'axios'
import { BACKEND_URL } from './envConstants'
import { auth } from './firebase'
import { toast } from 'react-toastify';

let logoutUser = null;

export const passLogout = (logout) => {
    logoutUser = logout;
}

const api = axios.create({
    baseURL : BACKEND_URL
})

api.interceptors.request.use(
    async (config) => {
        if(!config.url.includes('/signup') && !config.url.includes('/signin') && !config.url.includes('/check-user')) {
            const user = auth.currentUser;
            
            if(!user) {
                return Promise.reject(new Error('User did not log in!'))
            }

            const token = await user.getIdToken(true);
            
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    error => Promise.reject(error)
)

api.interceptors.response.use(
    response => response,
    async (error) => {
        if(error.response?.status === 401) {
            if(logoutUser) {
                logoutUser();
            }
        }
        const message = error.response?.data?.message || 'Something went wrong'
        toast.error(message)

        return Promise.reject(error)
    }
)

export default api;