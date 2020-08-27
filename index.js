const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


app.use(cors())

app.use(express.json()) 
app.use(express.static('build'))
morgan.token('post', function(request) {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//app.use(unknownEndpoint)
let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Henkilö X",
        "number": "12-43-2343440",
        "id": 4
      }
    ]


    app.get('/', (req, res) => {
        res.json(persons)
      })
      
      app.get('/api/persons', (req, res) => {
        res.json(persons)
      })

      app.get('/info', (req, res) => {
        const numberOfContacts = persons.length
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'long' }
        const event = new Date()
        const time = event.toLocaleDateString('en-GB', options)
        res.write(`<p>Phonebook has info for ${numberOfContacts} people</p>`)
        res.write(`<p>${time}</p>`)
        res.end()
      })    

      app.get('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        const person = persons.find(person => person.id === id)
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })

      app.delete('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        persons = persons.filter(person => person.id !== id)
      
        response.status(204).end()
      })
      
      const generateId = () => {
        const id = Math.random() * 999
        return id
      }
      
      app.post('/api/persons', (request, response) => {
        const body = request.body
        //console.log(body)
      
        if (!body.name) {
          return response.status(400).json({ 
            error: 'name missing' 
          })
        }

        if (!body.number) {
          return response.status(400).json({ 
            error: 'number missing' 
          })
        }

        if (persons.some(person => person.name === body.name)) {
          return response.status(400).json({ 
            error: 'name must be unique' 
          })
        }
      
        const person = {
          name: body.name,
          number: body.number,
          id: generateId(),
        }
      
        persons = persons.concat(person)
      
        response.json(person)
      })

      const PORT = process.env.PORT || 3001
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })    
    