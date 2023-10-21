import { useEffect, useContext } from 'react'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import Home from './components/Home'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationContext from './context/notificationContext'
import BlogsContext from './context/blogContext'
import { useMutation, useQuery } from '@tanstack/react-query'
import LoginContext from './context/loginContext'

import 'semantic-ui-css/semantic.min.css'
import { Menu, Button, Form, Icon, Header } from 'semantic-ui-react'
import styled from 'styled-components'

import { Route, Routes, Link } from 'react-router-dom'

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [blogs, blogsDispatch] = useContext(BlogsContext)
  const [login, loginDispatch] = useContext(LoginContext)


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


  if (login === null) {
    return (
      <div>
        <Menu>
          <Menu.Item name='home' as={Link} to={'/'}>
            Home
          </Menu.Item>
        </Menu>
        <Header as={'h2'} textAlign='center' icon>
          <Icon name='sign-in' />
          Log in to application
        </Header>
        <Notification
          message={notification.message}
          error={notification.isError}
        />
        <Form onSubmit={handleLogin}>
          <Form.Group id='formContainer'>
            <Form.Input
              label='Enter Username'
              type='text'
              name='username'
              className='username'
            />
            <Form.Input
              label='Enter Password'
              type='password'
              name='password'
              className='password'
            />
          </Form.Group>
          <Form.Group id='formContainer'>
            <Button type='submit' id='loginButton' animated>
              <Button.Content visible>Login</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button>
          </Form.Group>
        </Form>
      </div>
    )
  }
  return (
    <div>
      <Menu>
        <Menu.Item name='home' as={Link} to={'/'}>
          Home
        </Menu.Item>
        <Menu.Item name='users' as={Link} to={'/users'}>
          Users
        </Menu.Item>
        <Menu.Item>{login.name} logged in</Menu.Item>
        <Menu.Item position='right'>
          <Button onClick={handleLogout} className='secondary button' animated>
            <Button.Content visible>Logout</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow left' />
            </Button.Content>
          </Button>
        </Menu.Item>
      </Menu>
      <Notification
        message={notification.message}
        error={notification.isError}
      />
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
