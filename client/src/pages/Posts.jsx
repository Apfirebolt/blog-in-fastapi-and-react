import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getPosts, reset } from '../features/blog/blogSlice'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import PostItem from '../components/PostItem'

const Posts = () => {
  const { posts, isLoading, isSuccess } = useSelector(
    (state) => state.blog
  )

  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      if (isSuccess) {
        dispatch(reset())
      }
    }
  }, [dispatch, isSuccess])

  useEffect(() => {
    dispatch(getPosts())
  }, [dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div className="section-heading">
        <BackButton url='/' />
        <h1>Posts</h1>
      </div>
      <div className='posts'>
        <div className='post-headings'>
          <div>Title</div>
          <div>Content</div>
        </div>
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}

export default Posts
