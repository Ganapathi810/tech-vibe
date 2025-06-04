import { useState,useEffect } from 'react'
import { auth } from '../../config/firebase';
import { AuthContext } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { passLogout } from '../../config/api';
import { getSignedDisplayUrl } from '../services/getSignedDisplayUrl';

export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const logoutUser = async () => {
            await signOut(auth)
            navigate('/signin')
            setUser(null)
        }
        passLogout(logoutUser);
    },[])

    useEffect(() => {
        if(user) {
            if(!user.avatar.startsWith('http')) {
                getSignedDisplayUrl(user.avatar)
                    .then(({ signedUrl }) => {
                        if(signedUrl) {
                            setUser((prev) => ({
                                ...prev,
                                avatar : signedUrl
                            }))
                        }
                    })
                    .catch((error) => {
                        console.log('Failed to get the signed url for profile image in auth context : '+error.message)
                    })
            }
        }
    },[user])

    return (
        <AuthContext.Provider value={{ user,setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

