require('dotenv').config()
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const url = process.env.MONGODB_URI;
console.log(url)
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))

app.use(cors({
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}))
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
    }

const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Person = mongoose.model('Person', personSchema)

//app.use(requestLogger)
let persons = [
    {
      id: "1",
      name: "HTML is easy",
      number: "ouioiopou"
    },
    {
        id: "2",
        name: "HTMLs is easy",
        number: "ouioiopous"
    }
  ]

app.get('/', (request, response) => {
response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
response.send(`<p>Phone book has info for ${persons.length} people</p><br/> <p>${new Date().getTime()}</p>`
)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

app.get('/api/persons/:id', (request, response) => {
const person =  persons.find(person => person.id===request.params.id)
if (person){
response.json(person)
} else{
response.status(404).end()
}
})

app.delete('/api/persons/:id', (request, response) => {
const id = request.params.id
persons = persons.filter(person => person.id !== id)

response.status(204).end()
})

const generateId = () => {
const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
const body = request.body
console.log(request.body)
if (!body.name || !body.number) {
    console.log(body)
    return response.status(400).json({ 
        error: 'content missing' 
    })
}
if (persons.some((person)=>person.name===body.name)) {
    return response.status(409).json({
        error: 'name already exists in database'
    })
}
const person = {
    name: body.name,
    number: body.number,
    id: generateId()
}

persons = persons.concat(person)

response.json(person)
})


app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })