import { createContext, useContext, useReducer } from "react"

const BlogsContext = createContext()

const blogsReducer = (state, action) => {
    switch (action.type){
        case 'SETBLOGS':
            return action.payload
        case 'APPENDBLOG':
            return state.concat(action.payload)
        
    }
}

export const BlogsContextProvider = (props) => {
    const [blogs, blogsDispatch] = useReducer(blogsReducer, [{}])

    return(
        <BlogsContext.Provider value={[blogs, blogsDispatch]} >
            {props.children}
        </BlogsContext.Provider>
    )
}

export const useBlogValue = () => {
    const blogAndDispatch = useContext(BlogsContext)
    return blogAndDispatch[0]
}

export const useBlogDispatch = () => {
    const blogAndDispatch = useContext(BlogsContext)
    return blogAndDispatch[1]
}

export default BlogsContext