import { Link } from 'react-router-dom'
import { Table, TableHeader } from 'semantic-ui-react'

const BlogList = ({ blog }) => {
  if (!blog.user)
    return (
      <div>
        Loading...{' '}
        <div>
          <Icon loading size='big' name='cog' />
        </div>
      </div>
    )

  return (
    <Table className='ui fixed table'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Title</Table.HeaderCell>
          <Table.HeaderCell>Author</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </Table.Cell>
          <Table.Cell>{blog.author}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

export default BlogList
