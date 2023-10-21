import { useState, useEffect, useRef, useContext } from 'react'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import Home from './components/Home'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationContext from './context/notificationContext'
import BlogsContext from './context/blogContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LoginContext from './context/loginContext'

import { Route, Routes, Link, useLocation } from 'react-router-dom'

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [blogs, blogsDispatch] = useContext(BlogsContext)
  const [login, loginDispatch] = useContext(LoginContext)

  const queryClient = useQueryClient()
  // const blogFormRef = useRef()

  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (response) => {
      loginDispatch({ type: 'SETUSER', payload: response })
      window.localStorage.setItem('loggedInAppUser', JSON.stringify(response))
      blogService.setToken(response.token)
    },
    onError: (response) => {
      console.log(response)
      notificationDispatch({ type: 'SETERROR', payload: true })
      notificationDispatch({ type: 'SETMSG', payload: 'Wrong Credentials' })
      setTimeout(() => {
        notificationDispatch({ type: 'RESETMSG' })
      }, 5000)
    }
  })

  // check login on load
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInAppUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      loginDispatch({ type: 'SETUSER', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()
    const userObj = {
      username: event.target.username.value,
      password: event.target.password.value
    }
    loginMutation.mutate(userObj)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedInAppUser')
    loginDispatch({ type: 'CLEARUSER', payload: null })
  }

  // const toggleForm = () => {
  //   blogFormRef.current.toggleVisible()
  // }

  // Initial GET req for blogs
  const allBlogs = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  // req blogs on data change
  useEffect(() => {
    if (allBlogs.isSuccess)
      blogsDispatch({ type: 'SETBLOGS', payload: allBlogs.data })
  }, [allBlogs.data])

  const updateBlogs = async () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
  }

  if (login === null) {
    return (
      <div>
        <div>
          <Link style={{ padding: 5 }} to={'/'}>
            Home
          </Link>
          <Link style={{ padding: 5 }} to={'/users'}>
            Users
          </Link>
        </div>
        <h2>Log in to application</h2>
        <Notification
          message={notification.message}
          error={notification.isError}
        />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type='text' name='username' className='username' />
          </div>
          <div>
            password
            <input type='password' name='password' className='password' />
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
      <div>
        <Link style={{ padding: 5 }} to={'/'}>
          Home
        </Link>
        <Link style={{ padding: 5 }} to={'/users'}>
          Users
        </Link>
        {login.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <h2>blogs</h2>
      <Notification
        message={notification.message}
        error={notification.isError}
      />
      <p>
        {login.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Routes>
        <Route path='/' element={<Home blogs={blogs} login={login} />} />
        <Route path='/users' element={<Users />} />
        <Route path='/user/:id' element={<User />} />
        <Route path='blogs/:id' element={<Blog blogs={blogs} />} />
      </Routes>
    </div>
  )
}

export default App
