import UserContext from '../context/usersContext'
import { getUsers } from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useContext, useEffect } from 'react'

import { Header, Icon, Table } from 'semantic-ui-react'

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

  if (allUsers.isLoading)
    return (
      <div>
        Loading...{' '}
        <div>
          <Icon loading size='big' name='cog' />
        </div>
      </div>
    )
  return (
    <div>
      <Header as={'h2'} textAlign='right'>
        Blogs / Users
        <Icon circular name='users' size='big' />
      </Header>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Blogs Created</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => {
            return user.id ? (
              <Table.Row key={user.id}>
                <Table.Cell selectable>
                  <Link to={`../user/${user.id}`}> {user.name}</Link>
                </Table.Cell>
                <Table.Cell>
                  {user.blogs ? user.blogs.length : <div>loading</div>}
                </Table.Cell>
              </Table.Row>
            ) : null
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default Users
