import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RegisterFormValues, LoginFormValues, User, AuthState } from '../../types/User'
import authService from './authService'
import { toast } from 'react-toastify'
import type { RootState, AppDispatch } from '../../app/store'

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
export const register = createAsyncThunk<
    User,
    RegisterFormValues,
    {
        rejectValue: string;
        state: RootState;
        dispatch: AppDispatch;
    }
>(
    'auth/register',
    async (user: RegisterFormValues, thunkAPI) => { // thunkAPI is now implicitly typed
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
export const login = createAsyncThunk<
    User,
    LoginFormValues,
    {
        rejectValue: string;
        state: RootState;
        dispatch: AppDispatch;
    }
>(
    'auth/login',
    async (user: LoginFormValues, thunkAPI) => { // thunkAPI is now implicitly typed
        try {
            return await authService.login(user)
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.detail) ||
                error.message ||
                error.toString()
            toast.error(message)
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
        resetSuccess: (state) => {
            state.isSuccess = false
        }
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

export const { reset, resetSuccess } = authSlice.actions
export default authSlice.reducer