import { createSlice } from "@reduxjs/toolkit"
import loginService from "../services/login"
import blogService from '../services/blogs'
import { getUsers } from "../services/users"

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    logoutUser(state, action){
      return null
    },
  }
})

export const { setUser, logoutUser, allUsers } = userSlice.actions

export const loginReq = userObj => {
  return async dispatch => {
    const user = await loginService.login(userObj)
    blogService.setToken(user.token)
    window.localStorage.setItem('loggedInAppUser', JSON.stringify(user))
    dispatch(setUser(user))
  }
}

export const checkUser = () => {
  return dispatch => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInAppUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export default userSlice.reducer