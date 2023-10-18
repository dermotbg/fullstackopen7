import { useDispatch } from "react-redux"
import { useMatch } from "react-router-dom"
import { likeBlog } from "../reducers/blogReducer"

const Blog = ({ blogs }) => {
    if(!blogs) return <div>blog coming soon....</div>
    const match = useMatch('/blog/:id')
    const dispatch = useDispatch()
    

    const blog = match
        ? blogs.find(blog => blog.id === String(match.params.id))
        : null
    if(!blog) return <div>No blog located</div>

    return(
        <div>
            <h1>{blog.title} {blog.author}</h1>
            <a href={`https://${blog.url}`}><div>{blog.url}</div></a>
            <div>Likes: {blog.likes} <button onClick={() => dispatch(likeBlog(blog, blog.user.id))}>Like</button></div> 
            <div>Added By: {blog.user.name}</div>
        </div>
    )
}

export default Blog