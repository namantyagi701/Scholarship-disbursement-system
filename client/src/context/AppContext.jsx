import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"

export const AppContent = createContext()

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(null)
    const [authChecked, setAuthChecked] = useState(false)

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
            if (data.success) {
                setIsLoggedin(true)
                setUserData(data.user)
            }
        } catch (error) {
            // Not logged in — silently ignore 401
        } finally {
            setAuthChecked(true)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
            data.success ? setUserData(data.user) : toast.error(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not load user")
        }
    }

   
    const logoutUser = async () => {
        try {
            const { data } = await axios.post(backendUrl + "/api/auth/logout");
            if (data.success) {
                setIsLoggedin(false);
                setUserData(null);
                toast.success("Logged out");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    useEffect(() => {
        getAuthState();

        const handlePageShow = (e) => {
            if (e.persisted) {
                getAuthState();
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, [])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        logoutUser,
        authChecked
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
