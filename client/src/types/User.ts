export interface RegisterFormValues {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginFormValues {
    username: string;
    password: string;
}

export interface AuthResponse {
    id: string;
    username: string;
    email: string;
    token: string;
}

export interface User {
    id: string;
    email: string;
    username: string;
    token?: string; // Optional, used for authentication
}

export interface AuthState {
    user: User | null
    isError: boolean
    isSuccess: boolean
    isLoading: boolean
    message: string
}