import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from './blogService';
import { logout } from '../auth/authSlice'; // Ensure this path is correct
import { toast } from 'react-toastify';
import type { RootState, AppDispatch } from '../../app/store'; // Adjust path as per your store location

interface Comment {
    id: string;
    content: string;
    createdAt: string; // Consider using Date type if you parse it
}

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    comments?: Comment[];
}

interface BlogState {
    posts: Post[];
    post: Post | null; // Use null instead of {} for an empty post
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

// Initial state for the blog slice
const initialState: BlogState = {
    posts: [],
    post: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// --- Helper Functions ---

// Extracted type for ThunkAPI config
interface ThunkApiConfig {
    rejectValue: string;
    state: RootState;
    dispatch: AppDispatch;
}

// Helper function to handle common error logic, especially 401 Unauthorized
const handleApiError = (error: any, thunkAPI: ThunkApiConfig) => {
    const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

    // Check for specific 401 Unauthorized status
    if (error.response && error.response.status === 401) {
        toast.error('Session expired or unauthorized. Please log in again.');
        thunkAPI.dispatch(logout());
        return thunkAPI.rejectWithValue('Unauthorized');
    }

    // For other errors, just return the message
    toast.error(message); // Display toast for other errors
    return thunkAPI.rejectWithValue(message);
};

// --- Async Thunks ---

// Create new blog post
export const createPost = createAsyncThunk<
    Post, // Expected return type on success
    Omit<Post, 'id' | 'createdAt'>, // Input type for creating a post (omit generated fields)
    ThunkApiConfig // Thunk API configuration
>(
    'blog/createPost', // More descriptive action type
    async (postData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token; // Optional chaining for safety
            if (!token) {
                return thunkAPI.rejectWithValue('No authentication token found.');
            }
            const newPost = await blogService.createBlog(postData, token);
            toast.success('Post created successfully!');
            thunkAPI.dispatch(getPosts()); // Refresh posts after creation
            return newPost; // Return the created post data
        } catch (error) {
            return handleApiError(error, thunkAPI);
        }
    }
);

// Get all user posts
export const getPosts = createAsyncThunk<
    Post[],
    void,
    ThunkApiConfig
>(
    'blog/getPosts', // More descriptive action type
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                return thunkAPI.rejectWithValue('No authentication token found.');
            }
            return await blogService.getPosts(token);
        } catch (error) {
            return handleApiError(error, thunkAPI);
        }
    }
);

// Get a single post by ID (optional, but useful if you need to view/edit one)
export const getSinglePost = createAsyncThunk<
    Post,
    string, // Post ID as argument
    ThunkApiConfig
>(
    'blog/getSinglePost',
    async (postId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                return thunkAPI.rejectWithValue('No authentication token found.');
            }
            return await blogService.getSinglePost(token, postId); // Assuming blogService has getSinglePost
        } catch (error) {
            return handleApiError(error, thunkAPI);
        }
    }
);


// Delete a single user post
export const deletePost = createAsyncThunk<
    string, // Return the ID of the deleted post for UI updates (or void)
    string, // Post ID as argument
    ThunkApiConfig
>(
    'blog/deletePost',
    async (postId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                return thunkAPI.rejectWithValue('No authentication token found.');
            }
            await blogService.deletePost(token, postId);
            toast.success('Post deleted successfully!');
            return postId;
        } catch (error) {
            return handleApiError(error, thunkAPI);
        }
    }
);

// Update a single user post
export const updatePost = createAsyncThunk<
    Post, // Expected return type (the updated post)
    { postId: string; postData: Partial<Omit<Post, 'id' | 'createdAt'>> },
    ThunkApiConfig
>(
    'blog/updatePost',
    async ({ postId, postData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                return thunkAPI.rejectWithValue('No authentication token found.');
            }
            const updatedPost = await blogService.updatePost(postId, postData, token);
            toast.success('Post updated successfully!');
            // thunkAPI.dispatch(getPosts()); // Only dispatch if you really need a full refresh
            return updatedPost;
        } catch (error) {
            return handleApiError(error, thunkAPI);
        }
    }
);

// Post a comment on a blog post
export const postComment = createAsyncThunk<
    { postId: string; comment: any }, // Return type: post ID and the new comment
    { postId: string; commentData: { content: string } }, // Input type: post ID and comment content
    ThunkApiConfig
>(
    'blog/postComment',
    async ({ postId, commentData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                return thunkAPI.rejectWithValue('No authentication token found.');
            }
            const newComment = await blogService.postComment(postId, commentData, token);
            toast.success('Comment posted successfully!');
            return { postId, comment: newComment };
        } catch (error) {
            return handleApiError(error, thunkAPI);
        }
    }
);

// Delete a comment from a blog post
export const deleteComment = createAsyncThunk<
    { postId: string; commentId: string }, // Return type: post ID and comment ID for removal
    { postId: string; commentId: string }, // Input type: post ID and comment ID
    ThunkApiConfig
>(
    'blog/deleteComment',
    async ({ postId, commentId }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                return thunkAPI.rejectWithValue('No authentication token found.');
            }
            await blogService.deleteComment(postId, commentId, token);
            toast.success('Comment deleted successfully!');
            return { postId, commentId };
        } catch (error) {
            return handleApiError(error, thunkAPI);
        }
    }
);

// Update a comment on a blog post
export const updateComment = createAsyncThunk<
    { postId: string; comment: any }, // Return type: post ID and the updated comment
    { postId: string; commentId: string; commentData: { content: string } }, // Input type: post ID, comment ID and comment content
    ThunkApiConfig
>(
    'blog/updateComment',
    async ({ postId, commentId, commentData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                return thunkAPI.rejectWithValue('No authentication token found.');
            }
            const updatedComment = await blogService.updateComment(postId, commentId, commentData, token);
            toast.success('Comment updated successfully!');
            return { postId, comment: updatedComment };
        } catch (error) {
            return handleApiError(error, thunkAPI);
        }
    }
);

// --- Blog Slice Definition ---

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        reset: (state) => initialState,
        clearSinglePost: (state) => {
            state.post = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- createPost reducers ---
            .addCase(createPost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Add the new post to the beginning of the array
                state.posts.unshift(action.payload);
                state.message = 'Post created successfully!';
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })

            // --- getPosts reducers ---
            .addCase(getPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.posts = action.payload;
                state.message = 'Posts fetched successfully!';
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
                state.posts = []; // Clear posts on error
            })
            .addCase(getSinglePost.pending, (state) => {
                state.isLoading = true;
                state.post = null; // Clear previous single post
            })
            .addCase(getSinglePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.post = action.payload;
                state.message = 'Post fetched successfully!';
            })
            .addCase(getSinglePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
                state.post = null;
            })
            .addCase(deletePost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Filter out the deleted post directly from the state
                state.posts = state.posts.filter((post) => post.id !== action.payload);
                state.message = 'Post deleted successfully!';
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })

            // --- updatePost reducers ---
            .addCase(updatePost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Update the specific post in the array
                state.posts = state.posts.map((post) =>
                    post.id === action.payload.id ? action.payload : post
                );
                // Also update the single `post` if it's the one being updated
                if (state.post && 'id' in state.post && state.post.id === action.payload.id) {
                    state.post = action.payload;
                }
                state.message = 'Post updated successfully!';
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            // --- postComment reducers ---
            .addCase(postComment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(postComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Find the post and add the new comment to its comments array
                const post = state.posts.find((p) => p.id === action.payload.postId);
                if (post) {
                    if (!post.comments) {
                        post.comments = []; // Initialize comments if not present
                    }
                    post.comments.push(action.payload.comment);
                }
                state.message = 'Comment posted successfully!';
            })
            .addCase(postComment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            // --- deleteComment reducers ---
            .addCase(deleteComment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Find the post and remove the comment from its comments array
                const post = state.posts.find((p) => p.id === action.payload.postId);
                if (post && post.comments) {
                    post.comments = post.comments.filter((comment) => comment.id !== action.payload.commentId);
                }
                state.message = 'Comment deleted successfully!';
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            // --- updateComment reducers ---
            .addCase(updateComment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Find the post and update the specific comment in its comments array
                const post = state.posts.find((p) => p.id === action.payload.postId);
                if (post && post.comments) {
                    post.comments = post.comments.map((comment) =>
                        comment.id === action.payload.comment.id ? action.payload.comment : comment
                    );
                }
                state.message = 'Comment updated successfully!';
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })

            .addCase(logout.fulfilled, (state) => {
                state.posts = [];
                state.post = null;
                state.isError = false;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = '';
            });
    },
});

export const { reset, clearSinglePost } = blogSlice.actions;
export default blogSlice.reducer;