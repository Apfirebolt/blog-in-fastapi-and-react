import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getPosts, reset } from '../features/blog/blogSlice'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import TicketItem from '../components/TicketItem'

const Posts = () => {
  const { posts, isLoading, isSuccess } = useSelector(
    (state) => state.blog
  )

  const dispatch = useDispatch()
  
  console.log(posts, isLoading, isSuccess)
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
      <BackButton url='/' />
      <h1>Tickets</h1>
      <div className='posts'>
        <div className='post-headings'>
          <div>Date</div>
          <div>Product</div>
          <div>Status</div>
          <div></div>
        </div>
        {posts.map((post) => (
          <TicketItem key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}

export default Posts
