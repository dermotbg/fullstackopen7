import { Link } from 'react-router-dom'

const BlogList = ({ blog }) => {
  if (!blog.user) return <div>loading...</div>

  return (
    <div className='blogStyle'>
      <div className='title'>
        <Link to={`/blogs/${blog.id}`}>
          {' '}
          {blog.title} by {blog.author}{' '}
        </Link>
      </div>
    </div>
  )
}

export default BlogList
