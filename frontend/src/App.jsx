import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'
const Form = (props) => {
  const handleVarChange = (event) =>{
    props.setVariable(event.target.value)
  }
  return (<>
    {props.text}: <input value = {props.variable} onChange = {handleVarChange} className='form'/>
  </> )
}

const Persons = ({persons,search, deletePerson}) => {
  const filterPersons = () => {
    return ([...persons].filter(person => person.name.toLowerCase().includes(search.toLowerCase())))
  }
  return(    
    <ul>
    {filterPersons().map(person =>
      <li key = {person.id}>
        <Person person={person}  deletePerson={deletePerson} />
      </li>
    )}
  </ul>
  )
}

const Person = ({person, deletePerson}) => {
  return(
    <>
    <p>Name: {person.name} <br></br>Number: {person.number}</p> 
    <button onClick={() => deletePerson(person)}>delete</button>
    </>
  )
}

const App = () => {
  const [search,setNewSearch]= useState('')

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [id, setId] = useState(50)

  const [persons, setPersons] = useState([
    { name: 'Didnt get the server data', 
      number: '07942124352',
      id: 0
    }
  ]) 


  useEffect(() => {
    personService
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const deletePerson = person=>{
    if (confirm(`Are you sure you want to delete ${person.name}` )){
      personService.deleteObject(person.id).
      then(
        setPersons(persons.filter(p=> p.id!==person.id)),
        console.log(...persons)

      ).catch(error=>{
        console.log('Person already deleted'),
        alert('Person already deleted'),
        setPersons(persons.filter(p=> p.id!==person.id)),
        console.log(...persons)
      }
      )
    }
  }
  const addNewName = (event)=>{
    event.preventDefault()
    if (!persons.some((person)=>person.name===newName) && !persons.some((person)=>person.number===newNumber)){
      setId(id+1)
      const newPerson = {
      name: newName,
      number: newNumber,
      id: id.toString()
      }
      personService.create(newPerson).then(      
        setNewName(''),
        setNewNumber('')),
        setPersons(persons.concat(newPerson))  }
  else {
    alert(`Name ${newName} or number ${newNumber} is already in the phonebook`)
  }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div><Form text = {'Search'} variable = {search} setVariable= {setNewSearch}></Form></div>

      <h2>Add someone</h2>

      <div>
        <Form text ={'name'} variable = {newName} setVariable = {setNewName} ></Form>
        <br></br>
        <Form text ={'number'} variable = {newNumber} setVariable = {setNewNumber} ></Form>
        <br></br>
        <button type="submit" onClick={addNewName}>add</button>
      </div>

      <h2>Numbers</h2>
      <Persons persons={persons} search={search} deletePerson={deletePerson}></Persons>
      ...
    </div>
    
  )
}

export default App