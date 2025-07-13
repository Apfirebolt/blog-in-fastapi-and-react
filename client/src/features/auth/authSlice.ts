import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Types
interface User {
    id: string
    name: string
    email: string
    token: string
}

interface AuthState {
    user: User | null
    isError: boolean
    isSuccess: boolean
    isLoading: boolean
    message: string
}

interface RegisterData {
    name: string
    email: string
    password: string
}

interface LoginData {
    email: string
    password: string
}

// Get user from localstorage
const user: User | null = JSON.parse(localStorage.getItem('user') || 'null')

const initialState: AuthState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

// Register new user
export const register = createAsyncThunk<User, RegisterData, { rejectValue: string }>(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user)
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Login user
export const login = createAsyncThunk<User, LoginData, { rejectValue: string }>(
    'auth/login', 
    async (user, thunkAPI) => {
        try {
            return await authService.login(user)
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Logout user
export const logout = createAsyncThunk<void, void>(
    'auth/logout', 
    async () => {
        authService.logout()
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
    },
})

export const { reset } = authSlice.actions
export default authSlice.reducer