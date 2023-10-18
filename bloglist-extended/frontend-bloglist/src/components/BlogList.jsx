import PropTypes from 'prop-types'
import { useImperativeHandle, useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

const BlogList = ({ blog, updateBlogs, testToggleVisible, testLikeHandler }) => {
  const [visible, setVisible] = useState(false)

  const dispatch = useDispatch()

  const showWhenVisible = { display: visible ? '' : 'none' }

  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))
  if (!user) return null

  const toggleVisible = () => {
    setVisible(!visible)
    if (testToggleVisible) {
      testToggleVisible()
    }
  }

  const likeHandler = async (event) => {
    if (testLikeHandler) {
      testLikeHandler()
      return
    }
    event.preventDefault()
    dispatch(likeBlog({...blog}, blog.user.id))
  }


  const deleteHandler = async (event) => {
    event.preventDefault()

    if (
      window.confirm(`Remove blog ${blog.title} by ${blog.author}?`) &&
      blog.user.username === user.username) {
      const dummyBlog = {
        ...blog,
        token: user.token
      }
      dispatch(removeBlog(dummyBlog))
    } else {
      alert('blog not deleted, unauthorized user')
    }
  }

  BlogList.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlogs: PropTypes.func.isRequired
  }

  return (
    <div className="blogStyle">
      <div className="title">
        <Link to={`/blog/${blog.id}`}>{blog.title} by {blog.author}</Link>
        <button onClick={toggleVisible}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} className="extraInfo">
        <div>{blog.url}</div>
        <div className="likeContainer">
          likes: {blog.likes}{' '}
          <button onClick={likeHandler} className="likeButton">
            like
          </button>
        </div>
        <div>{blog.user.name ? blog.user.name : user.name}</div>
        {blog.user.username === user.username ? (
          <button onClick={deleteHandler}>delete</button>
        ) : null}
      </div>
    </div>
  )
}

export default BlogList
