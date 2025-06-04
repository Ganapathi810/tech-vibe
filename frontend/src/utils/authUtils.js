import { sendSignInLinkToEmail } from 'firebase/auth'
import { auth } from '../../config/firebase.js'
import api from '../../config/api.js';

 export const handleSubmit = async (e,userData,setIsSignInLinkSent,setError,setLoading) => {
    e.preventDefault();

    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

    const actionCodeSettings = {
        url : userData.name 
                ? `${FRONTEND_URL}/verify?name=${userData.name}`
                : `${FRONTEND_URL}/verify`,
        handleCodeInApp : true
    }

    try {
        setLoading(true)
        const response = await api.get(`/api/users/check-user/${userData.emailId}`) 
        const isUserExists = response.data.isUserExists

        if(userData.name) {
            if(isUserExists) {
                setError('User already exists with the specified email. Please, Sign in instead')
                setTimeout(() => setError(null),4000)
                return
            }
        } else {
            if(!isUserExists) {
                setError('User does not exist.Please, Sign up')
                setTimeout(() => setError(null),4000)
                return
            }
        }
        await sendSignInLinkToEmail(auth,userData.emailId,actionCodeSettings)
        setIsSignInLinkSent(true);
        window.localStorage.setItem('emailForSignIn',userData.emailId)
        setLoading(false)

    } catch (error) {
        setLoading(false)
        setError(`Error sending email Link, try again : ${error}`)
        console.log("Error sending email Link :"+error.message);
    }
}