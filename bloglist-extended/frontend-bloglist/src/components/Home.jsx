import BlogList from './BlogList'
import BlogForm from './BlogForm'
import { List } from '@mui/material'

const Home = ({ blogs, updateBlogs }) => {
  return (
    <div>
      <BlogForm />
      <List> 
        {blogs.map((blog) => (
          <BlogList key={blog.id} blog={blog} updateBlogs={updateBlogs} />
        ))}
      </List>
    </div>
  )
}

export default Home
