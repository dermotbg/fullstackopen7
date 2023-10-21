import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatch, useNavigate, Link } from 'react-router-dom'
import blogService from '../services/blogs'

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
      <h1>{blog.title}</h1>
      <h2>
        <strong>
          <em>{blog.author}</em>
        </strong>
      </h2>
      <p>Info:</p>
      <Link to={`https://${blog.url}`}>
        <p>{blog.url}</p>
      </Link>
      <p>
        <strong>Likes:</strong> {blog.likes}
      </p>

      <button onClick={likeHandler} color='primary'>
        Like This Blog
      </button>

      <p>
        Added By: <em>{blog.user.name}</em>
      </p>
      {blog.user.username === user.username ? (
        <button onClick={deleteHandler}>delete</button>
      ) : null}

      <div>
        <form onSubmit={commentHandler}>
          <h6>
            <em>Comments</em>
          </h6>
          <input
            placeholder='Add a Comment'
            label='Add a Comment'
            name='comment'
            id='title'
          />
          <button type='submit'>Post Comment</button>
        </form>
        {blog.comments.length === 0 ? (
          <p>No comments for this blog...Be the first!</p>
        ) : (
          <ul>
            {blog.comments.map((c) => (
              <li key={`${blog.id}-${blog.comments.indexOf(c)}`}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Blog
