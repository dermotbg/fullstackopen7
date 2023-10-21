import { createContext, useReducer } from 'react'

const LoginContext = createContext()

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'SETUSER':
      return action.payload
    case 'CLEARUSER':
      return null
  }
}

export const LoginContextProvider = (props) => {
  const [login, loginDispatch] = useReducer(loginReducer, null)

  return (
    <LoginContext.Provider value={[login, loginDispatch]}>
      {props.children}
    </LoginContext.Provider>
  )
}

export default LoginContext
