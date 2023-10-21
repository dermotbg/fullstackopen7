import { Link, useMatch } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import UserContext from '../context/usersContext'
import { getUsers } from '../services/users'
import { useQuery } from '@tanstack/react-query'

import { Header, Icon, List } from 'semantic-ui-react'

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

  if (!users)
    return (
      <div>
        Loading...{' '}
        <div>
          <Icon loading size='big' name='cog' />
        </div>
      </div>
    )

  const user = match
    ? users.find((user) => user.id === String(match.params.id))
    : null

  if (!user)
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
        Blogs / User / {user.name}
        <Icon circular name='user' size='big' />
      </Header>
      <Header as={'h3'}>
        <em>Blogs Added by {user.name}:</em>
      </Header>
      <List style={{ marginLeft: 50 }}>
        {user.blogs.map((u) => (
          <List.Item key={u.id}>
            <List.Icon name='thumbtack' size='large' verticalAlign='middle' />
            <List.Content>
              <Header as={'h3'}>
                {' '}
                <Link to={`../blogs/${u.id}`}> {u.title} </Link>{' '}
              </Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  )
}

export default User
