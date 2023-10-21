import UserContext from '../context/usersContext'
import { getUsers } from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useContext, useEffect } from 'react'

const Users = () => {
  const [users, usersDispatch] = useContext(UserContext)

  const allUsers = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })
  useEffect(() => {
    if (allUsers.isSuccess)
      usersDispatch({ type: 'SETUSERS', payload: allUsers.data })
  }, [allUsers])

  if (allUsers.isLoading) return <div>loading...</div>
  return (
    <div>
      <h3>
        <em>Users</em>
      </h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return user.id ? (
              <tr key={user.id}>
                <td>
                  <Link to={`../user/${user.id}`}> {user.name}</Link>
                </td>
                <td>{user.blogs ? user.blogs.length : <div>loading</div>}</td>
              </tr>
            ) : null
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Users
