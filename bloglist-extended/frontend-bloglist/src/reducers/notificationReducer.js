import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    currentMessage: '',
    isError: false
  },
  reducers: {
    currentMessage(state, action) {
      return action.payload
    },
    resetMessage(state, action) {
      return {
        currentMessage: '',
        isError: false
      }
    }
  }
})

export const { currentMessage, resetMessage } = notificationSlice.actions

export const setNotification = (message, error) => {
  return async (dispatch) => {
    await dispatch(
      currentMessage({
        currentMessage: message,
        isError: error
      })
    )
    setTimeout(() => {
      dispatch(resetMessage())
    }, 5000)
  }
}

export default notificationSlice.reducer
