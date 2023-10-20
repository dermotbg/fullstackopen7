import { useState, useEffect, useRef, useContext } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationContext from './context/notificationContext'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // const [errorMessage, setErrorMessage] = useState(null)
  // const [isError, setIsError] = useState(false)
  const [notification, notificationDispatch] = useContext(NotificationContext)



  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
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
      console.log(exception)
      // setIsError(true)
      notificationDispatch({ type: 'SETERROR', payload: true  })
      notificationDispatch({ type: 'SETMSG', payload: 'Wrong Credentials'  })
      // setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        // setErrorMessage(null)
      notificationDispatch({ type: 'RESETMSG' })
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInAppUser')
    setUser(null)
  }

  const addBlog = async (blogObj) => {
    blogFormRef.current.toggleVisible()
    try {
      const addUser = { ...blogObj, user: user }
      const response = await blogService.create(addUser)
      console.log(response)
      setBlogs(blogs.concat(response))
      notificationDispatch({ type: 'SETMSG', payload: `A New Blog: ${response.title} by ${response.author} added` })
      // setErrorMessage(
      //   `A New Blog: ${response.title} by ${response.author} added`
      // )
      setTimeout(() => {
        notificationDispatch({ type: 'RESETMSG' })
        // setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
    }
  }

  const updateBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} error={notification.isError} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              className='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              className='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='Submit' id='loginButton'>
            Login
          </button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} error={notification.isError} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='create blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateBlogs={updateBlogs} />
      ))}
    </div>
  )
}

export default App
