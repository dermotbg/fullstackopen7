import { Link } from 'react-router-dom'
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material'


const Users = ({ users }) => {
  if (!users) return <div>loading...</div>
  return (
    <div>
      <Typography variant='h3' color='primary'><em>Users</em></Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Name</TableCell>
              <TableCell>Blogs Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`../user/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
