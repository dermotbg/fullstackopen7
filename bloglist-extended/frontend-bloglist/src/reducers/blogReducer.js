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
    }
  }
})

export const { setBlogs , appendBlog, addLike, dropBlog } = blogSlice.actions

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

export const likeBlog = (blogObj, id) => {
  return async dispatch => {
    const update = {
      ...blogObj,
      user: id,
      likes: blogObj.likes + 1
    }
    await blogService.like(update)
    dispatch(addLike(update))
  }
}

export const removeBlog = blog => {
  return async dispatch => {
    await blogService.deleteBlog(blog)
    dispatch(dropBlog(blog))
  }
}

export default blogSlice.reducer