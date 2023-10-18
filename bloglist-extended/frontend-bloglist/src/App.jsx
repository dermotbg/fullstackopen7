import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import User from './components/User'
import Users from './components/Users'
import Home from './components/Home'
import { getBlogs } from './reducers/blogReducer'
import { loginReq, checkUser, logoutUser } from './reducers/userReducer'
import { pullUsers } from './reducers/allUsersReducer'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user) 
  const users = useSelector(state => state.allUsers)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkUser())
    dispatch(getBlogs())
    dispatch(pullUsers())
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
        {/* <BlogForm /> */}
      {/* {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateBlogs={updateBlogs} />
      ))} */}
        <Routes>
          <Route path='/' element={<Home blogs={blogs} updateBlogs={updateBlogs}/>} /> 
          <Route path='/users' element={<Users users={users}/>} />
          <Route path='/user/:id' element={<User users={users}/>}/>
          <Route path='blog/:id' element={<Blog blogs={blogs}/>} />
        </Routes> 
    </div>
  )
}

export default App
