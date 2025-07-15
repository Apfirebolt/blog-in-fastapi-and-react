import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormValues, LoginFormValues, AuthResponse } from '../../types/User'

const API_URL = 'http://localhost:8000/auth'

// Register user
const register = async (userData: RegisterFormValues): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(API_URL + '', userData)
    console.log('Register response:', response.data)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        toast.success('Registration successful!')
    }
    return response.data
}

// Login user
const login = async (userData: LoginFormValues): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(API_URL + '/login', userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        toast.success('Login successful!')
    }
    return response.data
}

// Logout user
const logout = (): void => {
    localStorage.removeItem('user')
    toast.info('Logged out successfully!')
}

const authService = {
    register,
    logout,
    login,
}

export default authService