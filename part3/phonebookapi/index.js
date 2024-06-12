const http = require('http')
const express = require('express')
const fs = require('fs')
const app = express()
const morgan = require('morgan')

app.use(express.json())

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

// Crear un token personalizado para registrar el cuerpo de las solicitudes POST
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// Configurar morgan para registrar mensajes en la consola utilizando la configuración "tiny" y el token personalizado
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

  const getPersons = () => {
  const data = fs.readFileSync('persons.json', 'utf-8')
  return JSON.parse(data)
  }

  const savePersons = (persons) => {
    fs.writeFileSync('persons.json', JSON.stringify(persons, null, 2))
  }

  app.get('/api/persons', (request, response) => {
    const persons = getPersons()
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const persons = getPersons()
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
        response.status(404).send('No se ha encontrado en contacto')
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    let persons = getPersons()
    // Filtrar la lista de personas para excluir la entrada con el ID proporcionado
    const filteredPersons = persons.filter(person => person.id !== id)
    // Verificar si se eliminó alguna entrada
    if (persons.length !== filteredPersons.length) {
        // Guardar la nueva lista de personas en el archivo JSON
        savePersons(filteredPersons)
        response.status(204).end() // Indicar que la operación se realizó con éxito (No Content)
    } else {
        // Si no se encuentra ninguna entrada con el ID dado, devolver un error 404
        response.status(404).json({ error: 'Entry not found' })
    }
  })  
  
  const generateId = (persons) => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body  
    // Verificar si falta el nombre o el número en la solicitud
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number is missing' 
      })
    }  
    // Verificar si el nombre ya existe en el directorio telefónico
    const persons = getPersons()
    const duplicateName = persons.find(person => person.name === body.name)
    if (duplicateName) {
      return response.status(400).json({ 
        error: 'Name already exists in the phonebook' 
      })
    }  
    // Generar un nuevo ID único
    const id = Math.floor(Math.random() * 1000000)  
    // Crear un nuevo objeto de persona
    const newPerson = {
      id: id,
      name: body.name,
      number: body.number
    }  
    // Agregar la nueva persona a la lista
    persons.push(newPerson)  
    // Guardar la lista actualizada en el archivo JSON
    savePersons(persons)  
    // Responder con la nueva persona creada
    response.json(newPerson)
  })
    
  app.get('/info', (request, response) => {
    const date = new Date()
    const persons = getPersons()
    const numberOfEntries = persons.length
  
    const info = `
      <p>Request received at: ${date}</p>
      <p>Number of entries in the phonebook: ${numberOfEntries}</p>
    `
  
    response.send(info)
  })

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)