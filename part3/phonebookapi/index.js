require('dotenv').config();


const http = require('http');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const mongoModule = require('./mongoModule'); // Import the Mongoose module

const app = express();
app.use(express.json());

// Create a custom token for logging the body of POST requests
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Configure morgan to log messages in the console using the "tiny" configuration and the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', async (request, response) => {
  try {
    const persons = await mongoModule.getAllPersons();
    response.json(persons);
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: 'Failed to fetch persons' });
  }
});

app.get('/api/persons/:id', async (request, response) => {
  const id = Number(request.params.id);
  try {
    const persons = await mongoModule.getAllPersons();
    const person = persons.find(p => p.id === id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).send('Contact not found');
    }
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: 'Failed to fetch person' });
  }
});

app.delete('/api/persons/:id', async (request, response) => {
  const id = Number(request.params.id);
  let persons = await mongoModule.getAllPersons();
  // Filter the list of persons to exclude the entry with the given ID
  const filteredPersons = persons.filter(person => person.id !== id);
  // Check if any entry was deleted
  if (persons.length !== filteredPersons.length) {
    // Save the new list of persons to the JSON file
    savePersons(filteredPersons);
    response.status(204).end(); // Indicate that the operation was successful (No Content)
  } else {
    // If no entry with the given ID is found, return a 404 error
    response.status(404).json({ error: 'Entry not found' });
  }
});

app.post('/api/persons', async (request, response) => {
  const body = request.body;
  // Check if the name or number is missing in the request
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or number is missing' 
    });
  }
  // Check if the name already exists in the phonebook
  const persons = await mongoModule.getAllPersons();
  const duplicateName = persons.find(person => person.name === body.name);
  if (duplicateName) {
    return response.status(400).json({ 
      error: 'Name already exists in the phonebook' 
    });
  }
  // Add the new person to the database
  try {
    const newPerson = await mongoModule.addPerson(body.name, body.number);
    response.json(newPerson);
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: 'Failed to add person' });
  }
});

app.get('/info', async (request, response) => {
  const date = new Date();
  try {
    const persons = await mongoModule.getAllPersons();
    const numberOfEntries = persons.length;
    const info = `
      <p>Request received at: ${date}</p>
      <p>Number of entries in the phonebook: ${numberOfEntries}</p>
    `;
    response.send(info);
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: 'Failed to fetch persons' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
