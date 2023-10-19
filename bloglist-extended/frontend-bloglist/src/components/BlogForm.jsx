import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useRef } from 'react'
import Togglable from './Togglable'

const BlogForm = ({ testCreateBlog }) => {

  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))


  const submitBlog = (event) => {
    if(testCreateBlog){
      testCreateBlog()
      return
    }
    event.preventDefault()
    blogFormRef.current.toggleVisible()
    const blogObj = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
      user: user
    }
    dispatch(addBlog(blogObj))
    dispatch(setNotification(`A New Blog: ${event.target.title.value} by ${event.target.author.value} added`, false))
  }

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
