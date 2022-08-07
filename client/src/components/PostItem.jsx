import { FaRegEdit, FaTrash } from 'react-icons/fa'

const PostItem = (props) => {
  const { post, deletePostAction } = {...props}
  return (
    <div className='post'>
      <div>{props.post.title}</div>
      <p>
        {post.content}
      </p>
      <div className="action-buttons">
        <button className="btn btn-danger">
          <FaRegEdit /> Edit
        </button>
        <button className="btn" onClick={() => deletePostAction(props.post.id)}>
           <FaTrash /> Delete
        </button>
      </div>
    </div>
  )
}

export default PostItem
