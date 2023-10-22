import { useDispatch } from 'react-redux'
import { useMatch, useNavigate, Link } from 'react-router-dom'
import { likeBlog, removeBlog, addComment } from '../reducers/blogReducer'
import { Button, Box, Divider, ListItem, List, Typography, TextField, styled } from '@mui/material'
import { v4 as uuidv4 } from 'uuid' 

const Blog = ({ blogs }) => {
  const match = useMatch('/blogs/:id')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  if (!blogs) return <div>blog coming soon....</div>

  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))

  const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    '& > :not(style) ~ :not(style)': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }));

  const blog = match
    ? blogs.find((blog) => blog.id === String(match.params.id))
    : null
  if (!blog) return <div>No blog located</div>

  const deleteHandler = (event) => {
    event.preventDefault()

    if (
      window.confirm(`Remove blog ${blog.title} by ${blog.author}?`) &&
      blog.user.username === user.username
    ) {
      const dummyBlog = {
        ...blog,
        token: user.token
      }
      dispatch(removeBlog(dummyBlog))
      navigate('/')
    } else {
      alert('blog not deleted')
    }
  }

  const likeHandler = () => {
    const update = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    dispatch(likeBlog(update))
  }

  const commentHandler = (event) => {
    event.preventDefault()
    const update = {
      ...blog,
      comments: blog.comments.concat(event.target.comment.value)
    }
    dispatch(addComment(update))
  }

  return (
    <Root>
      <Divider textAlign='left'>Title</Divider>
      <Typography variant='h3' color='primary'>
        {blog.title}
      </Typography>
      <Divider textAlign='left'>Author</Divider>
      <Typography variant='h6' color='secondary'>  
        <strong><em>{blog.author}</em></strong> 
      </Typography>
      <Divider textAlign='right'>
        Info:
      </Divider>
      <Link to={`https://${blog.url}`} > 
        <Typography align='right'>
          {blog.url}
        </Typography> 
      </Link>
      <Typography align='right'>
        <strong>Likes:</strong>  {blog.likes} 
      </Typography>
      <Typography align='right'> 
        <Button onClick={likeHandler} color='primary' >Like This Blog</Button>
      </Typography>  
      <Typography align='right'>
        Added By: <em>{blog.user.name}</em>
      </Typography>
      {blog.user.username === user.username ? (
        <Divider>
        <Button onClick={deleteHandler}>delete</Button>
        </Divider>
      ) : null}

      <div>
        <form onSubmit={commentHandler}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'right',
          maxWidth: '50%',
          marginLeft: '25%' }}>
            <Typography variant='h6' color='primary' align='center'><em>Comments</em></Typography>
            <TextField placeholder='Add a Comment' label='Add a Comment' name='comment' id='title' size='small' margin='dense' fullWidth={true} />
            <Button type='submit'>Post Comment</Button>
          </Box>
        </form>
        {blog.comments.length === 0 ? (
          <Typography>No comments for this blog...Be the first!</Typography>
        ) : (
          
            <List>
                {blog.comments.map((c) => (
                 <ListItem key={uuidv4()} sx={{ padding: 2 }}> &#8226; {c} </ListItem>
                ))}
          </List>
          
        )}
      </div>
    </Root>
  )
}

export default Blog
