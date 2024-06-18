
const { MongoClient, ServerApiVersion } = require('mongodb');

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}


const uri = "mongodb+srv://vosalazar26:<pw>@clustervlads.luqtkgj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterVladS";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useUnifiedTopology: true
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db("phonebookapivladsDB");
    const collection = db.collection("phonebookapiVS");

    if (process.argv.length === 3) {
      // List all entries
      const persons = await collection.find({}).toArray();
      console.log('Phonebook:');
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
    } else if (process.argv.length === 5) {
      // Add a new entry
      const name = process.argv[3];
      const number = process.argv[4];

      const newPerson = { name, number };
      const result = await collection.insertOne(newPerson);
      console.log(`Added ${name} number ${number} to phonebook`);
    } else {
      console.log('Usage: node mongo.js <password> [name] [number]');
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection
    await client.close();
  }
}

run().catch(console.dir);

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
