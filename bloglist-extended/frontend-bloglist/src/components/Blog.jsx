import { useDispatch } from "react-redux"
import { useMatch, useNavigate } from "react-router-dom"
import { likeBlog, removeBlog } from "../reducers/blogReducer"

const Blog = ({ blogs }) => {
    if(!blogs) return <div>blog coming soon....</div>
    const match = useMatch('/blog/:id')
    const dispatch = useDispatch()
    const navigate = useNavigate()

  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))
    

    const blog = match
        ? blogs.find(blog => blog.id === String(match.params.id))
        : null
    if(!blog) return <div>No blog located</div>

    const deleteHandler = (event) => {
        event.preventDefault()
    
        if (
          window.confirm(`Remove blog ${blog.title} by ${blog.author}?`) &&
          blog.user.username === user.username) {
          const dummyBlog = {
            ...blog,
            token: user.token
          }
          dispatch(removeBlog(dummyBlog))
          navigate('/')
        } else {
          alert('blog not deleted, unauthorized user')
        }
      }

    const likeHandler = () => {
        const update = {
            ...blog,
            user: blog.user.id,
            likes: blog.likes + 1
          }
          dispatch(likeBlog(update))
    }
      
    return(
        <div>
            <h1>{blog.title} {blog.author}</h1>
            <a href={`https://${blog.url}`}><div>{blog.url}</div></a>
            <div>Likes: {blog.likes} <button onClick={likeHandler}>Like</button></div> 
            <div>Added By: {blog.user.name}</div>
            <div>
                {blog.user.username === user.username ? (
                <button onClick={deleteHandler}>delete</button>
                ) : null}
            </div>
        </div>
    )
}

export default Blog