import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification.currentMessage)
  const error = useSelector((state) => state.notification.isError)

  if (!notification) {
    return null
  }
  const clr = { color: error ? 'red' : 'green' }
  return (
    <div className='message' style={clr}>
      {' '}
      {notification}
    </div>
  )
}

export default Notification
