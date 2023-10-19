import { Link } from "react-router-dom"

const Users = ({ users }) => {

    if(!users) return <div>loading...</div>
    return(
        <div>
            <h1>Users</h1>
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Blogs Created</th>
                    </tr>
                        {users.map((user) =>
                            <tr key={user.id}>
                                <td><Link to={`../user/${user.id}`}>{user.name}</Link></td>
                                <td>{user.blogs.length}</td>
                            </tr>
                        )}
                </tbody>
            </table>
        </div>
    )
}

export default Users