import axios from 'axios'

const API_URL = 'http://localhost:8000/'

interface UserData {
    email: string
    password: string
    name?: string
}

interface AuthResponse {
    token: string
    user: {
        id: string
        email: string
        name: string
    }
}

// Register user
const register = async (userData: UserData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(API_URL + 'auth', userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

// Login user
const login = async (userData: UserData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(API_URL + 'auth/login', userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

// Logout user
const logout = (): void => localStorage.removeItem('user')

const authService = {
    register,
    logout,
    login,
}

export default authService