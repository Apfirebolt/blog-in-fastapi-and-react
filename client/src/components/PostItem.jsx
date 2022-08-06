const PostItem = ({ post }) => {
  return (
    <div className='post'>
      <div>{post.title}</div>
      <p>
        {post.content}
      </p>
    </div>
  )
}

export default PostItem
