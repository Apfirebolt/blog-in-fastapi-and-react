import axios from 'axios'

const API_URL = 'http://localhost:8000/auth'

interface UserData {
    email: string
    password: string
    username?: string
    firstName?: string
    lastName?: string
}

interface LoginData {
    username: string
    password: string
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
    const response = await axios.post<AuthResponse>(API_URL + '', userData)
    console.log('Register response:', response.data)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

// Login user
const login = async (userData: LoginData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(API_URL + '/login', userData)

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