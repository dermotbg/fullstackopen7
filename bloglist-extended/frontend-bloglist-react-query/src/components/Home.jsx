import BlogList from './BlogList'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { useRef } from 'react'
import { Header, Icon } from 'semantic-ui-react'

const Home = ({ blogs, login, updateBlogs }) => {
  const blogFormRef = useRef()

  const toggleForm = () => {
    blogFormRef.current.toggleVisible()
  }

  return (
    <div>
      <Header as={'h2'} textAlign='right'>
        Blogs / Home
        <Icon circular name='home' size='big' />
      </Header>
      <Togglable buttonLabel='create blog' ref={blogFormRef}>
        <BlogForm user={login} toggleForm={toggleForm} />
      </Togglable>
      {blogs.map((blog) => {
        return blog.id ? (
          <BlogList key={blog.id} blog={blog} updateBlogs={updateBlogs} />
        ) : null
      })}
    </div>
  )
}

export default Home
