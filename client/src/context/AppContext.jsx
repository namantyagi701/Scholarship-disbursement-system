import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"

export const AppContent = createContext()

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const hasStoredSession = Boolean(localStorage.getItem('ssp_has_session'));
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    // If no session flag exists, public visitors don't need to wait on a blocking auth screen
    const [authChecked, setAuthChecked] = useState(!hasStoredSession);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
            if (data.success) {
                setIsLoggedin(true)
                setUserData(data.user)
                localStorage.setItem('ssp_has_session', 'true');
            } else {
                setIsLoggedin(false);
                setUserData(null);
                localStorage.removeItem('ssp_has_session');
            }
        } catch (error) {
            // Not logged in — silently ignore 401
            setIsLoggedin(false);
            setUserData(null);
            localStorage.removeItem('ssp_has_session');
        } finally {
            setAuthChecked(true)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
            if (data.success) {
                setUserData(data.user);
                setIsLoggedin(true);
                localStorage.setItem('ssp_has_session', 'true');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not load user")
        }
    }

   
    const logoutUser = async () => {
        try {
            localStorage.removeItem('ssp_has_session');
            const { data } = await axios.post(backendUrl + "/api/auth/logout");
            if (data.success) {
                setIsLoggedin(false);
                setUserData(null);
                toast.success("Logged out");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            setIsLoggedin(false);
            setUserData(null);
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
