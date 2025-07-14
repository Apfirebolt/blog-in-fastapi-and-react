import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface User {
    // Define user properties based on your user object structure
    id: string
    email: string
    // Add other user properties as needed
}

interface AuthState {
    user: User | null
}

interface RootState {
    auth: AuthState
}

interface UseAuthStatusReturn {
    loggedIn: boolean
    checkingStatus: boolean
}

export const useAuthStatus = (): UseAuthStatusReturn => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [checkingStatus, setCheckingStatus] = useState<boolean>(true)

    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
        setCheckingStatus(false)
    }, [user])

    return { loggedIn, checkingStatus }
}