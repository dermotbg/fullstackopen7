import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { getBlogs } from './reducers/blogReducer'

const App = () => {
  const blogs = useSelector(state => state.blogs)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBlogs())
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInAppUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedInAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Wrong Credentials', true))
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInAppUser')
    setUser(null)
  }

  // const addBlog = async (blogObj) => {
  //   blogFormRef.current.toggleVisible()
  //   try {
  //     const response = await blogService.create(blogObj)
  //     console.log(response)
  //     dispatch(setBlogs(blogs.concat(response)))
  //     dispatch(setNotification(`A New Blog: ${response.title} by ${response.author} added`, false))
  //   } catch (exception) {
  //     console.log(exception)
  //   }
  // }

  // const updateBlogs = async () => {
  //   const blogs = await blogService.getAll()
  //   setBlogs(blogs)
  // }

  const updateBlogs = () => {
    dispatch(getBlogs())
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              className="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              className="password"
              onChange={({ target }) => setPassword(target.value)}
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
