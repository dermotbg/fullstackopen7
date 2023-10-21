import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotiDispatch } from '../context/notificationContext'

const BlogForm = ({ user, toggleForm }) => {
  const queryClient = useQueryClient()
  const dispatchNoti = useNotiDispatch()

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
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <input name='title' placeholder='title' id='title' />
        </div>
        <div>
          <input name='author' placeholder='author' id='author' />
        </div>
        <div>
          <input name='url' placeholder='url' id='url' />
        </div>
        <button type='submit' id='submit' onClick={() => toggleForm()}>
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm
