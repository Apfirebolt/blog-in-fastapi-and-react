import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import blogService from './blogService'
import { toast } from "react-toastify";

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

interface BlogState {
    posts: Post[];
    post: Post | {};
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

interface RootState {
    auth: {
        user: {
            id: string;
            username: string;
            email: string;
            token: string;
        };
    };
}

const initialState: BlogState = {
    posts: [],
    post: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

// Create new blog
export const createPost = createAsyncThunk<
    Post,
    any,
    { state: RootState; rejectValue: string }
>(
    'blog/',
    async (postData: Post, thunkAPI: any) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await blogService.createBlog(postData, token)
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

// Get user posts
export const getPosts = createAsyncThunk<
    Post[],
    void,
    { state: RootState; rejectValue: string }
>(
    'blog/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await blogService.getPosts(token)
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

// Delete single user post
export const deletePost = createAsyncThunk<
    void,
    string,
    { state: RootState; rejectValue: string }
>(
    'blog/delete',
    async (postId: string, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.access_token
            await blogService.deletePost(token, postId)
            toast.success('Deleted post successfully')
            thunkAPI.dispatch(getPosts());
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

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createPost.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(getPosts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.posts = action.payload
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
            .addCase(deletePost.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deletePost.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload as string
            })
    },
})

export const { reset } = postSlice.actions
export default postSlice.reducer