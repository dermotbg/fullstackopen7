import PropTypes from 'prop-types'
import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogs, testToggleVisible, testLikeHandler }) => {
  const [visible, setVisible] = useState(false)
  // add likes state to add/subtract per load, can be added twice on page reload but not writing liked user data to db
  const [likes, setLikes] = useState(blog.likes)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))

  const toggleVisible = () => {
    setVisible(!visible)
    if(testToggleVisible){
      testToggleVisible()
    }
  }

  const likeHandler = async (event) => {
    if(testLikeHandler){
      testLikeHandler()
      return
    }
    event.preventDefault()
    const blogObj = {
      user: blog.user.id,
      likes: likes === blog.likes ? blog.likes + 1 : likes - 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    }
    try {
      await blogService.like(blogObj)
      likes === blog.likes ? setLikes(blog.likes + 1) : setLikes(likes -1)
    }
    catch (exception){
      console.log(exception)
    }
  }

  const deleteHandler = async (event) => {
    event.preventDefault()

    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`) && blog.user.username === user.username){
      blog.token = user.token
      try {
        await blogService.deleteBlog(blog)
        updateBlogs()
        alert('Blog deleted')
      }
      catch(exception){
        console.log(exception)
      }
    }
    else{
      alert('blog not deleted, unauthorized user')
    }
  }

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlogs: PropTypes.func.isRequired
  }

  return (
    <div className="blogStyle">
      <div className='title'>
        {blog.title} by {blog.author}
        <button onClick={toggleVisible}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} className='extraInfo'>
        <div>
          {blog.url}
        </div>
        <div className='likeContainer'>
          likes: {likes} <button onClick={likeHandler} className='likeButton'>{ likes === blog.likes ? 'like' : 'unlike' }</button>
        </div>
        <div>
          {blog.user.name ? blog.user.name : user.name}
        </div>
        {blog.user.username === user.username ? <button onClick={deleteHandler}>delete</button> : null}
      </div>
    </div>
  )
}

export default Blog