import React from 'react'
import '@testing-library/jest-dom'
import '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'created in test',
  author: 'Tim Tester',
  url: 'www.shouldnotshow.com'
}

test('Calls createBlog with right details when new blog is created', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  await user.type(titleInput, blog.title)

  const authorInput = screen.getByPlaceholderText('author')
  await user.type(authorInput, blog.author)

  const urlInput = screen.getByPlaceholderText('url')
  await user.type(urlInput, blog.url)

  const createButton = screen.getByText('create')
  await user.click(createButton)


  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('created in test')
  expect(createBlog.mock.calls[0][0].author).toBe('Tim Tester')
  expect(createBlog.mock.calls[0][0].url).toBe('www.shouldnotshow.com')

})