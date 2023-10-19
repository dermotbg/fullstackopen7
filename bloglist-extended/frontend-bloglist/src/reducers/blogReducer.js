import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    addLike(state, action) {
      const id = action.payload.id
      const blogToChange = state.find(b => b.id === id)
      const changedBlog = { ...blogToChange, likes: blogToChange.likes + 1 }
      return state.map(b => b.id !== id ? b : changedBlog )
    },
    dropBlog(state, action) {
      return state.filter(b => b.id !== action.payload.id)
    },
    pushComment(state, action) {
      const id = action.payload.id
      const blogToChange = state.find(b => b.id === id)
      const changedBlog = {...blogToChange, comments: blogToChange.comments.concat(action.payload.comments.at(-1))}
      return state.map(b => b.id !== id ? b : changedBlog)
    }
  }
})

export const { setBlogs , appendBlog, addLike, dropBlog, pushComment } = blogSlice.actions

export const getBlogs = () => {
  return async dispatch => {
   const blogs = await blogService.getAll()
   dispatch(setBlogs(blogs))
  }
}

export const addBlog = blogObj => {
  return async dispatch => {
    const newBlog = await blogService.create(blogObj)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (blogObj) => {
  return async dispatch => {
    await blogService.like(blogObj)
    dispatch(addLike(blogObj))
  }
}

export const removeBlog = blog => {
  return async dispatch => {
    await blogService.deleteBlog(blog)
    dispatch(dropBlog(blog))
  }
}

export const addComment = (blog) => {
  return async dispatch => {
    await blogService.postComment(blog)
    dispatch(pushComment(blog))
  }
} 

export default blogSlice.reducer