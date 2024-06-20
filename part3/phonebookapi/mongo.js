require('dotenv').config();


const mongoose = require('mongoose');
const mongoModule = require('./mongoModule'); // Import the Mongoose module
require('dotenv').config();

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}

const password = process.argv[2];
const uri = `mongodb+srv://vosalazar26:${password}@clustervlads.luqtkgj.mongodb.net/phonebook?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    run();
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

async function run() {
  if (process.argv.length === 3) {
    // List all entries
    try {
      const persons = await mongoModule.getAllPersons();
      console.log('Phonebook:');
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
    } catch (error) {
      console.error('Error fetching persons:', error.message);
    } finally {
      mongoose.connection.close();
    }
  } else if (process.argv.length === 5) {
    // Add a new entry
    const name = process.argv[3];
    const number = process.argv[4];

    try {
      const newPerson = await mongoModule.addPerson(name, number);
      console.log(`Added ${newPerson.name} number ${newPerson.number} to phonebook`);
    } catch (error) {
      console.error('Error adding person:', error.message);
    } finally {
      mongoose.connection.close();
    }
  } else {
    console.log('Usage: node mongo.js <password> [name] [number]');
    mongoose.connection.close();
  }
}

/*
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const url = "mongodb+srv://vosalazar26:${password}@clustervlads.luqtkgj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterVladS";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // List all entries
  Person.find({}).then(result => {
    console.log('Phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // Add a new entry
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to the phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Please provide the correct number of arguments: node mongo.js <password> <name> <number>');
  mongoose.connection.close();
}
  */
