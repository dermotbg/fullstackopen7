import { createContext, useContext, useReducer } from "react"

const BlogsContext = createContext()

const blogsReducer = (state, action) => {
    switch (action.type){
        case 'SETBLOGS':
            return action.payload
        case 'APPENDBLOG':
            return state.concat(action.payload)
        case 'LIKEBLOG':
            const id = action.payload.id
            const blogToChange = state.find((b) => b.id === id)
            const changedBlog = { ...blogToChange, likes: blogToChange.likes + 1 }
            return state.map((b) => (b.id !== id ? b : changedBlog))
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