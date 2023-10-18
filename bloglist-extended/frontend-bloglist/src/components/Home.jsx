import Blog from "./Blog"
import BlogForm from "./BlogForm"

const Home = ({ blogs, updateBlogs }) => {
    return(
        <div>
            <BlogForm />
            {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} updateBlogs={updateBlogs} />
              ))}
        </div>
    )
}

export default Home