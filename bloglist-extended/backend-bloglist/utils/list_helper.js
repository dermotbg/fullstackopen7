const _ = require('lodash')

const dummy = () => {return 1}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, blog) => accumulator + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  return blogs.reduce((topVal, currentVal) => {
    return (topVal && topVal.likes > currentVal.likes)
      ? topVal
      : currentVal
  })
}

const mostBlogs = (blogs) => {
  const groupedObj = _.groupBy(blogs, 'author')
  const formattedObj = _.map(groupedObj, (entries, author) => ({ author, blogs: entries.length }))
  const mostBlogs = _.maxBy(formattedObj, 'blogs')
  return mostBlogs
}

const mostLikes = (blogs) => {
  const groupedObj = _.groupBy(blogs, 'author')
  const formattedObj = _.map(groupedObj, (likes, author) => ({ author, likes: _.reduce(likes, (acca, likes) => acca + likes.likes, 0) }))
  const mostLikes = _.maxBy(formattedObj, 'likes')
  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
