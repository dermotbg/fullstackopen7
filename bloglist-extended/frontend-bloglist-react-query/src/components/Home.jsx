import BlogList from './BlogList'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { useRef } from 'react'

const Home = ({ blogs, login, updateBlogs }) => {
  const blogFormRef = useRef()

  const toggleForm = () => {
    blogFormRef.current.toggleVisible()
  }

  return (
    <div>
      <Togglable buttonLabel='create blog' ref={blogFormRef}>
        <BlogForm user={login} toggleForm={toggleForm} />
      </Togglable>
      <ul className='ul'>
        {blogs.map((blog) => {
          return blog.id ? (
            <BlogList key={blog.id} blog={blog} updateBlogs={updateBlogs} />
          ) : null
        })}
      </ul>
    </div>
  )
}

export default Home
