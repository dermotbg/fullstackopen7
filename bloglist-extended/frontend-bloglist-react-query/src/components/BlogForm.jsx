import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useRef } from 'react'
import { useNotiDispatch } from '../context/notificationContext'
import { Header, Icon, Form, Button } from 'semantic-ui-react'

const BlogForm = ({ user, toggleForm }) => {
  const queryClient = useQueryClient()
  const dispatchNoti = useNotiDispatch()
  const blogFormRef = useRef()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatchNoti({
        type: 'SETMSG',
        payload: `A New Blog: ${response.title} by ${response.author} added`
      })
      setTimeout(() => {
        dispatchNoti({ type: 'RESETMSG' })
      }, 5000)
    }
  })

  const addBlog = (event) => {
    event.preventDefault()
    toggleForm()
    try {
      const blogObj = {
        title: event.target.title.value,
        author: event.target.author.value,
        url: event.target.url.value,
        user: user
      }
      console.log('blogobj', blogObj)
      newBlogMutation.mutate(blogObj)
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <Icon name='pencil' size='big' />
      <Header as={'h3'} icon>
        <em>Create new</em>
      </Header>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Input
            label='Title'
            name='Title'
            placeholder='title'
            id='title'
          />
          <Form.Input
            label='Author'
            name='author'
            placeholder='author'
            id='author'
          />
          <Form.Input label='URL' name='url' placeholder='url' id='url' />
        </Form.Group>
        <Button
          type='submit'
          id='submit'
          onClick={() => toggleForm()}
          color='green'
        >
          Create
        </Button>
        <Button type='button' onClick={() => toggleForm()} color='black'>
          Cancel
        </Button>
      </Form>
    </div>
  )
}

export default BlogForm
