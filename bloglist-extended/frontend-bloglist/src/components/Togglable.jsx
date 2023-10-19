import PropTypes from 'prop-types'
import { Button } from '@mui/material'

import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisible = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisible
    }
  })

  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }

  Togglable.displayName = 'Togglable'

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisible}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        {/* <Button color='warning' onClick={toggleVisible}>cancel</Button> */}
      </div>
    </div>
  )
})

export default Togglable
