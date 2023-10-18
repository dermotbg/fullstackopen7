import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { getBlogs } from './reducers/blogReducer'
import { loginReq, checkUser, logoutUser } from './reducers/userReducer'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user) 

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkUser())
    dispatch(getBlogs())
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    const userObj = { username: event.target.username.value, password: event.target.password.value}
    try {
      dispatch(loginReq(userObj))
    } catch (exception) {
      dispatch(setNotification('Wrong Credentials', true))
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInAppUser')
    dispatch(logoutUser())
  }

  const updateBlogs = () => {
    dispatch(getBlogs())
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              name="username"
              className="username"
            />
          </div>
          <div>
            password
            <input
              type="password"
              name="password"
              className="password"
            />
          </div>
          <button type="Submit" id="loginButton">
            Login
          </button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
        <BlogForm />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateBlogs={updateBlogs} />
      ))}
    </div>
  )
}

export default App
