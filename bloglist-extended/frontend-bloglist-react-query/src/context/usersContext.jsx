import { createContext, useContext, useReducer } from 'react'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SETUSERS':
      return action.payload
    case 'CLEARUSERS':
      return [{}]
  }
}

export const UserContextProvider = (props) => {
  const [users, usersDispatch] = useReducer(userReducer, [{}])

  return (
    <UserContext.Provider value={[users, usersDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const usersDispatch = () => {
  const usersAndDispatch = useContext(UserContext)
  return usersAndDispatch[1]
}

export const usersState = () => {
  const usersAndDispatch = useContext(UserContext)
  return usersAndDispatch[0]
}

export default UserContext
