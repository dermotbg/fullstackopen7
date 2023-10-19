import { useMatch } from 'react-router-dom'

const User = ({ users }) => {
  const match = useMatch('/user/:id')

  if (!users) return <div>user not found...yet....</div>

  const user = match
    ? users.find((user) => user.id === String(match.params.id))
    : null

  return (
    <div>
      <h1>{user.name}</h1>
      <h3>Added Blogs:</h3>
      <ul>
        {user.blogs.map((u) => (
          <li key={u.id}>{u.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
