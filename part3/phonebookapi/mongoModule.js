const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!mongoose.connection.readyState) {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message);
    });
} else {
  console.log('Using existing MongoDB connection');
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema, 'phonebookapiVS');

const getAllPersons = async () => {
  try {
    const persons = await Person.find({});
    return persons;
  } catch (error) {
    console.error('Error fetching persons:', error);
    throw error;
  }
};

const addPerson = async (name, number) => {
  const person = new Person({
    name,
    number,
  });
  try {
    const savedPerson = await person.save();
    return savedPerson;
  } catch (error) {
    console.error('Error adding person:', error);
    throw error;
  }
};

module.exports = {
  getAllPersons,
  addPerson,
};
