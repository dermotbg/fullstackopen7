import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ListItem, ListItemButton, ListItemText } from '@mui/material'

const BlogList = ({ blog }) => {
  const user = JSON.parse(window.localStorage.getItem('loggedInAppUser'))
  if (!user) return null

  BlogList.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlogs: PropTypes.func.isRequired
  }

  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} to={`/blogs/${blog.id}`} >
        <ListItemText style={{ textAlign: 'left' }} primary={`${blog.title} by ${blog.author}`}/>
      </ListItemButton>
    </ListItem>
  )
}

export default BlogList
