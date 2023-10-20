import { createContext, useContext, useReducer } from "react"

const NotificationContext = createContext()

const initialState = {
  message: null,
  isError: false
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SETMSG":
      return {...state, message: action.payload}
      case "SETERROR":
        return {...state, isError: action.payload}
    case "RESETMSG":
      return initialState
}}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, initialState)

  return(
    <NotificationContext.Provider value={[notification, notificationDispatch]} >
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotiValue = () => {
  const notiAndDispatch = useContext(NotificationContext)
  return notiAndDispatch[0]
}

export const useNotiDispatch = () => {
  const notiAndDispatch = useContext(NotificationContext)
  return notiAndDispatch[1]
}

export default NotificationContext