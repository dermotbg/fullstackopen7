import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatch, useNavigate, Link } from 'react-router-dom'
import blogService from '../services/blogs'
import { v4 as uuidv4 } from 'uuid'

import {
  Button,
  Container,
  Form,
  Header,
  Icon,
  Label,
  List
} from 'semantic-ui-react'

const Blog = ({ blogs }) => {
  const match = useMatch('/blogs/:id')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  if (!blogs) return <div>blog coming soon....</div>

  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))

  const newLikeMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const newCommentMutation = useMutation({
    mutationFn: blogService.postComment,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      navigate('/')
    }
  })

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
      blog.token = user.token
      try {
        deleteMutation.mutate(blog)
        alert('Blog deleted')
      } catch (exception) {
        console.log(exception)
      }
    } else {
      alert('blog not deleted, unauthorized user')
    }
  }

  const likeHandler = (event) => {
    event.preventDefault()
    try {
      newLikeMutation.mutate({
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1
      })
    } catch (exception) {
      console.log(exception)
    }
  }

  const commentHandler = (event) => {
    event.preventDefault()
    const update = {
      ...blog,
      comments: blog.comments.concat(event.target.comment.value)
    }
    newCommentMutation.mutate(update)
  }

  return (
    <div>
      <Container textAlign='left'>
        <Header as={'h1'}>{blog.title}</Header>
      </Container>
      <Container textAlign='left'>
        <Header as={'h2'}>
          <strong>
            <em>{blog.author}</em>
          </strong>
        </Header>
      </Container>
      <Container textAlign='center'>
        <Header as={'h3'}>Info:</Header>
        <br />
        <em>Find the blog here:</em>
        <Link to={`https://${blog.url}`}>
          <p>{blog.url}</p>
        </Link>
        <br />
        <div>
          <em>Like the blog here:</em>
        </div>
        <Button as='div' labelPosition='right'>
          <Button color='blue' onClick={likeHandler}>
            <Icon name='heart' />
            Like
          </Button>
          <Label as='a' basic color='black' pointing='left'>
            {blog.likes}
          </Label>
        </Button>

        <p>
          {' '}
          Added By: <em>{blog.user.name}</em>
        </p>
        {blog.user.username === user.username ? (
          <Button onClick={deleteHandler} animated>
            <Button.Content visible>Delete</Button.Content>
            <Button.Content hidden>
              <Icon name='trash' />
            </Button.Content>
          </Button>
        ) : null}
      </Container>
      <div>
        <br />
        <Container>
          <Header as={'h2'}>
            <em>Comments</em>
          </Header>
          <Form onSubmit={commentHandler}>
            <Form.Input
              placeholder='Add a Comment'
              label='Add a Comment'
              name='comment'
              id='title'
            />
            <Button type='submit' color='green'>
              Post Comment
            </Button>
          </Form>
          {blog.comments.length === 0 ? (
            <p>
              <Icon name='frown' /> No comments for this blog...Be the first!
            </p>
          ) : (
            <List>
              {blog.comments.map((c) => (
                <List.Item key={uuidv4()}>
                  <Icon name='user' /> {c}
                </List.Item>
              ))}
            </List>
          )}
        </Container>
      </div>
    </div>
  )
}

export default Blog
