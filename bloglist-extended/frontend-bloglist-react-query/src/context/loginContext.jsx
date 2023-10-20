import { createContext, useReducer } from "react"

const LoginContext = createContext()

const blogsReducer = (state, action) => {
    switch (action.type) {
        case 'SETUSER':
            return action.payload
        case 'CLEARUSER':
            return null
    }
}

export const LoginContextProvider = (props) => {
    const [user, userDispatch] = useReducer(blogsReducer, null)

    return(
        <LoginContext.Provider value={ [user, userDispatch] } >
            {props.children}
        </LoginContext.Provider>
    )
}

export default LoginContext