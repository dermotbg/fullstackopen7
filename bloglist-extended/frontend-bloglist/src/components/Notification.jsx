const Notification = ({ message, error }) => {
  if (message === null){
    return null
  }
  const clr = { color: error ? 'red' : 'green' }
  return(
    <div className="message" style={clr}> {message}</div>
  )
}

export default Notification