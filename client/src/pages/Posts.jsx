import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getPosts, deletePost, reset } from "../features/blog/blogSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import PostItem from "../components/PostItem";

const Posts = () => {
  const { posts, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.blog
  );

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (isSuccess) {
        dispatch(reset());
      }
    };
  }, [dispatch, isSuccess]);

  const deletePostAction = (postId) => {
    dispatch(deletePost(postId));
  };

  if (isError) {
    toast.error(message);
  }

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="section-heading">
        <BackButton url="/" />
        <h1>Posts</h1>
      </div>
      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <div className="posts">
          <div className="post-headings">
            <div>Title</div>
            <div>Content</div>
            <div>Actions</div>
          </div>
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              deletePostAction={deletePostAction}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
