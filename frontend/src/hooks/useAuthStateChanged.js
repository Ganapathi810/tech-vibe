import { useEffect,useState } from "react";
import { getIdToken, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from "./useAuth"
import { auth } from "../../config/firebase";
import api from "../../config/api";

export const useAuthStateChanged = () => {
    const [loading,setLoading] =useState(true);
    const { setUser } = useAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if(currentUser) {
                try {
                    const token = await getIdToken(currentUser);
                    const response = await api.get(`/api/users/check-user/${currentUser.email}`)
                    const userFromDatabase = response.data.isUserExists
                    setUser({ 
                        _id : currentUser.uid,
                        name : userFromDatabase ? userFromDatabase.name : currentUser.displayName,
                        avatar : userFromDatabase ? userFromDatabase.avatar :currentUser.photoURL,
                        token
                    })
                } catch (error) {
                    console.log('Eror getting token or something went wrong',error.message)
                }
            }
            else {
                setUser(null);
            }
            setLoading(false)
        })

        return () => unsubscribe();
    },[])

    return loading;
} 