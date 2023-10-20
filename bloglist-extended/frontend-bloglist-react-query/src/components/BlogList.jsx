import PropTypes from 'prop-types'
import { useState } from 'react'
import blogService from '../services/blogs'
import { useBlogDispatch } from '../context/blogContext'
import { useQueryClient, useMutation } from '@tanstack/react-query'

const BlogList = ({ blog, updateBlogs, testToggleVisible, testLikeHandler }) => {
  const [visible, setVisible] = useState(false)

  const queryClient = useQueryClient()
  const showWhenVisible = { display: visible ? '' : 'none' }

  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))

  const newLikeMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const toggleVisible = () => {
    setVisible(!visible)
    if (testToggleVisible) {
      testToggleVisible()
    }
  }

  const likeHandler = (event) => {
    if (testLikeHandler) {
      testLikeHandler()
      return
    }
    event.preventDefault()
    try {
      newLikeMutation.mutate({...blog, user: blog.user.id, likes: blog.likes +1})
    } catch (exception) {
      console.log(exception)
    }
  }

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

  BlogList.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlogs: PropTypes.func.isRequired
  }


  if(!blog.user) return <div>loading...</div>

  return (
    <div className='blogStyle'>
      <div className='title'>
        {blog.title} by {blog.author}
        <button onClick={toggleVisible}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} className='extraInfo'>
        <div>{blog.url}</div>
        <div className='likeContainer'>
          likes: {blog.likes}{' '}
          <button onClick={likeHandler} className='likeButton'>
            like
          </button>
        </div>
        <div>{blog.user.name ? blog.user.name : user.name}</div>
        {blog.user.username === user.username ? (
          <button onClick={deleteHandler}>delete</button>
        ) : null}
      </div>
    </div>
  )
}

export default BlogList
