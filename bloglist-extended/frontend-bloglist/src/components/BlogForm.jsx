import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useRef } from 'react'
import Togglable from './Togglable'
import { Box, Button, Container, TextField, Typography } from '@mui/material'

const BlogForm = ({ testCreateBlog }) => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))

  const submitBlog = (event) => {
    if (testCreateBlog) {
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
    dispatch(
      setNotification(
        `A New Blog: ${event.target.title.value} by ${event.target.author.value} added`,
        false
      )
    )
  }
  // if (!blogFormRef.current === 'undefined') return <div>Loading</div>

  return (
    <Togglable buttonLabel='create blog' ref={blogFormRef}>
      <Container>
        <Typography variant='h6' color='primary' textAlign='centre'><em>create new</em></Typography>
        <form onSubmit={submitBlog}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center', }}>
              <TextField placeholder='Title' label='Title' id='title' size='small' margin='dense' fullWidth={true} />
              <TextField placeholder='Author' label='Author' id='author' size='small' margin='dense' fullWidth={true}  />
              <TextField placeholder='URL' id='url' label='URL' size='small' margin='dense' fullWidth={true}  />
          </Box>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly' }}>
            <Button type='submit' id='submit'>
              create
            </Button>
            <Button color='warning' onClick={() => blogFormRef.current.toggleVisible()}>cancel</Button>
          </Box>
        </form>
      </Container>
    </Togglable>
  )
}

export default BlogForm
