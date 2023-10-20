import { useState, useEffect, useRef, useContext } from 'react'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationContext from './context/notificationContext'
import BlogsContext from './context/blogContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LoginContext from './context/loginContext'

const App = () => {
  
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [blogs, blogsDispatch] = useContext(BlogsContext)
  const [user, userDispatch] = useContext(LoginContext)
  
  const queryClient = useQueryClient()
  const blogFormRef = useRef()

  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess:(response) => {
      userDispatch({ type: 'SETUSER', payload: response })
      window.localStorage.setItem('loggedInAppUser', JSON.stringify(response))
      blogService.setToken(user.token)
    },
    onError: (response) => {
      console.log(resonse)
      notificationDispatch({ type: 'SETERROR', payload: true  })
      notificationDispatch({ type: 'SETMSG', payload: 'Wrong Credentials'  })
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
    userDispatch({ type: 'CLEARUSER', payload: null })
  }

  const toggleForm = () => {
    blogFormRef.current.toggleVisible()
  }
  
  // Initial GET req for blogs
  const allBlogs = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  // req blogs on data change
  useEffect(() => {
    if(allBlogs.isSuccess) blogsDispatch({ type: 'SETBLOGS', payload: allBlogs.data })
  },[allBlogs.data])
  
  const updateBlogs = async () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
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
              name='username'
              className='username'
            />
          </div>
          <div>
            password
            <input
              type='password'
              name='password'
              className='password'
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
        <BlogForm user={user} toggleForm={toggleForm}/>
      </Togglable>
      {blogs.map((blog) => (
        <BlogList key={blog.id} blog={blog} updateBlogs={updateBlogs}/>
      ))}
    </div>
  )
}

export default App
