// import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useRef } from 'react'
import Togglable from './Togglable'

const BlogForm = () => {

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const submitBlog = (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisible()
    const blogObj = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value
    }
    dispatch(addBlog(blogObj))
    dispatch(setNotification(`A New Blog: ${event.target.title.value} by ${event.target.author.value} added`, false))
  }
  // BlogForm.propTypes = {
  //   createBlog: PropTypes.func.isRequired
  // }
  return (
    <Togglable buttonLabel="create blog" ref={blogFormRef}>
    <div>
      <h2>create new</h2>
      <form onSubmit={submitBlog}>
        <div>
          <input
            placeholder="title"
            id="title"
          />
        </div>
        <div>
          <input
            placeholder="author"
            id="author"
          />
        </div>
        <div>
          <input
            placeholder="url"
            id="url"
          />
        </div>
        <button type="submit" id="submit">
          create
        </button>
      </form>
    </div>
    </Togglable>
  )
}

export default BlogForm
