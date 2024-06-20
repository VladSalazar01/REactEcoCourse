require('dotenv').config();


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

const Person = mongoose.model('Person', personSchema);

const getAllPersons = () => {
  return Person.find({});
};

const addPerson = (name, number) => {
  const person = new Person({
    name,
    number,
  });
  return person.save();
};

module.exports = {
  getAllPersons,
  addPerson,
};
