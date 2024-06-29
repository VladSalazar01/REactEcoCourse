import React from 'react';

const Person = ({ person, deletePerson }) => (
  <li>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person.id)}>delete</button>
  </li>
);

const Persons = ({ persons, deletePerson }) => (
  //falta actualizar completo
  <ul>
    {persons.map(person => 
      <li key={person._id}>
      {person.name} {person.number}
      <button onClick={() => deletePerson(person._id)}>delete</button>
    </li>
    )}
  </ul>
);

export default Persons;
