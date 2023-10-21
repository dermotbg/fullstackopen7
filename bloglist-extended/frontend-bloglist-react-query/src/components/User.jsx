import { useMatch } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import UserContext from '../context/usersContext'
import { getUsers } from '../services/users'
import { useQuery } from '@tanstack/react-query'

const User = () => {
  const [users, usersDispatch] = useContext(UserContext)
  const match = useMatch('/user/:id')

  const allUsers = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })
  useEffect(() => {
    if (allUsers.isSuccess)
      usersDispatch({ type: 'SETUSERS', payload: allUsers.data })
  }, [allUsers])

  if (!users) return <div>user not found...yet....</div>

  const user = match
    ? users.find((user) => user.id === String(match.params.id))
    : null

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h3>{user.name}</h3>
      <h4>
        <em>Added Blogs:</em>
      </h4>
      <ul>
        {user.blogs.map((u) => (
          <li key={u.id}>{u.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
