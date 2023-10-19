import { createSlice } from '@reduxjs/toolkit'
import { getUsers } from '../services/users'

const allUsersSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    allUsers(state, action) {
      return action.payload
    }
  }
})

export const { allUsers } = allUsersSlice.actions

export const pullUsers = () => {
  return async (dispatch) => {
    const response = await getUsers()
    dispatch(allUsers(response))
  }
}

export default allUsersSlice.reducer
