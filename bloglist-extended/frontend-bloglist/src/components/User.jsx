import { List, ListItem, Typography } from '@mui/material'
import { useMatch } from 'react-router-dom'

const User = ({ users }) => {
  const match = useMatch('/user/:id')

  if (!users) return <div>user not found...yet....</div>

  const user = match
    ? users.find((user) => user.id === String(match.params.id))
    : null

  return (
    <div>
      <Typography variant='h3'>{user.name}</Typography>
      <Typography variant='h4' color='primary'><em>Added Blogs:</em></Typography>
      <List>
        {user.blogs.map((u) => (
          <ListItem key={u.id}>{u.title}</ListItem>
        ))}
      </List>
    </div>
  )
}

export default User
