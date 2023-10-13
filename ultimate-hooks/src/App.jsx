import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const resetValues = () => setValue('')

  return {
    type,
    value,
    onChange,
    resetValues
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
  axios.get(baseUrl)
    .then(response => setResources(response.data))
    .catch(error => console.error(error))
  },[baseUrl])

  const create = (resource) => {
    axios.post(baseUrl, resource)
      .then(response => setResources([...resources, response.data]))
      .catch(error => console.error(error))
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ 
      content: content.value, 
      timestamp: new Date().toISOString(), 
      important: false 
    })
    content.resetValues()
  }
  
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ 
      name: name.value, 
      number: number.value
    })
    name.resetValues()
    number.resetValues()
  }
  const {resetValues: _1, ...contentProps} = content
  const {resetValues: _2, ...nameProps} = name
  const {resetValues: _3, ...numberProps} = number

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...contentProps} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...nameProps} /> <br/>
        number <input {...numberProps} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App