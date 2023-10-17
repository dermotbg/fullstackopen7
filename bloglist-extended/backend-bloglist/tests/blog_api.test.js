const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'root_user', passwordHash })
  await user.save()

  await Blog.deleteMany({})
  const blogObjs = helper.initialBlogs
    .map(b => new Blog({ ...b, user: user._id })) // adding in users _id to blog creation so the middleware picks it up.
  const promiseArray = blogObjs.map(b => b.save())
  await Promise.all(promiseArray)
})


describe('All blogs are returned', () => {
  test('return all blogs', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDB()
    expect(response).toHaveLength(helper.initialBlogs.length)
  }, 10000)
})

describe('Verification of id definition', () => {
  test('verify blogs id is defined as id', async () => {
    const resp = await api.get('/api/blogs')
    resp.body.forEach( (r) => {
      expect(r.id).toBeDefined()
    })
  })
})

describe('Blog creation', () => {
  test('a valid blog can be added', async () => {

    const token = await helper.generateToken()

    const newBlog = {
      title: 'Blog created in test',
      author: 'Dermot',
      url: '/test/blog',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDB()
    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    const titles = response.map(r => r.title)
    expect(titles).toContain('Blog created in test')
  })

  test('a blog without a token is rejected', async () => {

    const newBlog = {
      title: 'A blog with no token',
      author: 'Dermot',
      url: '/test/blog',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDB()
    expect(response).toHaveLength(helper.initialBlogs.length)
    const titles = response.map(r => r.title)
    expect(titles).not.toContain('A blog with no token')
  })
})


describe('Default behaviour', () => {
  test('empty likes value defaults to zero', async () => {
    const token = await helper.generateToken()

    const newBlog = {
      title: 'Empty likes value',
      author: 'Dermot',
      url: '/test/blog'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDB()
    const result = response.find(r => r.title === 'Empty likes value')
    expect(result.likes).toEqual(0)
  })

})

describe('Rejecting missing values', () => {
  test('blogs without title rejected', async () => {
    const blogWithoutTitle = {
      author: 'Invalid Title',
      url: '/test/blog',
      likes: 9
    }
    await api
      .post('/api/blogs')
      .send([blogWithoutTitle])
      .expect(400)
    const response = await helper.blogsInDB()
    expect(response.map(r => r.author)).not.toContain('Invalid Title')
  })

  test('blogs without url will be rejected', async () => {
    const blogWithoutURL = {
      title: 'Blog without URL',
      author: 'Dermot',
      likes: 5
    }
    await api
      .post('/api/blogs')
      .send(blogWithoutURL)
      .expect(400)

    const response = await helper.blogsInDB()
    expect(response.map(r => r.title)).not.toContain('Blog without URL')

  })
})

describe('Deleting and Updating blogs', () => {
  test('blogs can be deleted', async () => {
    const token = await helper.generateToken()


    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]


    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    const contents = blogsAtEnd.map(b => b.id)
    expect(contents).not.toContain(blogToDelete.id)
  })

  test('blogs can be updated', async () => {
    const allBlogs = await helper.blogsInDB()
    const blogToUpdate = allBlogs[0]

    const updatedLikes = { ...blogToUpdate, likes: 91 }

    await api
      .put(`/api/blogs/${updatedLikes.id}`)
      .send(updatedLikes)
      .expect(204)

    const blogAfterUpdate = await helper.blogsInDB()
    expect(blogAfterUpdate[0].likes).toEqual(91)
  })
})

// User tests

describe('User Creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('valid user is created', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'defaultuser',
      name: 'Default User',
      password: 'pazzwurd',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length +1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails with proper statuscode if username is taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'root',
      name: 'Test username',
      password: 'sekret'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('expected `username` to be unique')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('fails with proper statuscode if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'te',
      name: 'Test username',
      password: 'test_password'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('User validation failed: username: Path `username` (`te`) is shorter than the minimum allowed length (3)')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('fails with proper statuscode if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'test_username',
      name: 'Test username',
      password: 'ta'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('password must be longer that 3 characters')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('username is required', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      name: 'Test username',
      password: 'test_Password'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('Path `username` is required.')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('password is required', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'test_username',
      name: 'Test username'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('password must be provided')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})