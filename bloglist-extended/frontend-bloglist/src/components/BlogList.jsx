import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const BlogList = ({ blog }) => {

  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))
  if (!user) return null

  BlogList.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlogs: PropTypes.func.isRequired
  }

  return (
    <div className="blogStyle">
      <div className="title">
        <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
      </div>
    </div>
  )
}

export default BlogList
