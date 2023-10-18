import BlogList from "./BlogList"
import BlogForm from "./BlogForm"

const Home = ({ blogs, updateBlogs }) => {
    return(
        <div>
            <BlogForm />
            {blogs.map((blog) => (
                <BlogList key={blog.id} blog={blog} updateBlogs={updateBlogs} />
              ))}
        </div>
    )
}

export default Home