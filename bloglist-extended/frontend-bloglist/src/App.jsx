import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'

import Blog from './components/Blog'
import Notification from './components/Notification'
import User from './components/User'
import Users from './components/Users'
import Home from './components/Home'
import { getBlogs } from './reducers/blogReducer'
import { loginReq, checkUser, logoutUser } from './reducers/userReducer'
import { pullUsers } from './reducers/allUsersReducer'
import { Route, Routes, Link } from 'react-router-dom'

import { AppBar, Button, Box, Container, Toolbar, IconButton, TextField, Typography } from '@mui/material'
import '@fontsource/roboto/300.css'
import './index.css'

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.allUsers)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkUser())
    dispatch(getBlogs())
    dispatch(pullUsers())
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    const userObj = {
      username: event.target.username.value,
      password: event.target.password.value
    }
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
      <Container>
        <AppBar postition='fixed' style={{ background: '#FFFFFF' }}>
        <Toolbar>
          <Box
              component="img"
              sx={{
              height: 30,
              }}
              alt="Your logo."
              src={'https://elementsdesign.com/wp-content/uploads/2016/10/blog-logo-black-css.jpg'}
          />
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
          ></IconButton>
          <Button style={{ color: '#000000' }} component={Link} to='/'>
            Home
          </Button>
          <Button style={{ color: '#000000' }} component={Link} to='/users'>
            Users
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar style={{ marginBottom: 20 }} />
        <Typography variant='h6' >Log in to application</Typography>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            <TextField label='username' name='username' className='username' size='small' margin='normal'/>
          </div>
          <div>
            <TextField label='password' size='small' type='password' name='password' className='password' margin='normal' />
          </div>
          <Button color='primary' type='Submit' id='loginButton'>
            Login
          </Button>
        </form>
      </Container>
    )
  }
  return (
    <div>
      <AppBar postition='fixed' style={{ background: '#FFFFFF' }}>
        <Toolbar>
          <Box
              component="img"
              sx={{
              height: 30,
              }}
              alt="Your logo."
              src={'https://elementsdesign.com/wp-content/uploads/2016/10/blog-logo-black-css.jpg'}
          />
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
          ></IconButton>
          <Button style={{ color: '#000000' }} component={Link} to='/'>
            Home
          </Button>
          <Button style={{ color: '#000000' }} component={Link} to='/users'>
            Users
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar style={{ marginBottom: 20 }} />
      <Typography variant='h5' gutterBottom component={Link} to='/' sx={{ textDecoration: 'none' }}>BLOGS</Typography>
      <Notification />
      <Typography align='right' gutterBottom>
        Welcome {user.name}! You are logged in.
        <Button onClick={handleLogout}>logout</Button>
      </Typography>
      <Routes>
        <Route
          path='/'
          element={<Home blogs={blogs} updateBlogs={updateBlogs} />}
        />
        <Route path='/users' element={<Users users={users} />} />
        <Route path='/user/:id' element={<User users={users} />} />
        <Route path='blogs/:id' element={<Blog blogs={blogs} />} />
      </Routes>
    </div>
  )
}

export default App
