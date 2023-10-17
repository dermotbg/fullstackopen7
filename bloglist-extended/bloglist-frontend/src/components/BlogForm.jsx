import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }
  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div><input value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder='title' id='title' /></div>
        <div><input value={newAuthor} onChange={event => setNewAuthor(event.target.value)} placeholder='author' id='author' /></div>
        <div><input value={newUrl} onChange={event => setNewUrl(event.target.value)} placeholder='url' id='url' /></div>
        <button type="submit" id='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm