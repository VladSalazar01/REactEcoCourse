import React from 'react';

const Person = ({ person, deletePerson }) => (
  <li>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person.id)}>delete</button>
  </li>
);

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map(person => (
        <div key={person._id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person._id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
