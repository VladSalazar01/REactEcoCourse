import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import personService from './services/persons';
import './index.css'
import Note from './components/Note'
//import Course from './components/Course'
import CountryFilter from './CountryFilter';


//EJERCICIOS 2.6 - 2.18


//componente para notificaciones de error
const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }
  const className = type === 'error' ? 'error' : 'success';
  return (
    <div className={className}>
      {message}
    </div>
  );
};

// Componente para el filtro de búsqueda
const SearchFilter = ({ searchTerm, handleSearchTerm }) => (
  <div>
    {/* Campo de entrada para el término de búsqueda */}
    filter shown with: <input value={searchTerm} onChange={handleSearchTerm} />
  </div>
);

// Componente para el formulario de agregar personas
const PersonForm = ({ newName, handleNewName, newNumber, handleNewNumber, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      {/* Campo de entrada para el nombre */}
      name: <input value={newName} onChange={handleNewName} />
    </div>
    <div>
      {/* Campo de entrada para el número de teléfono */}
      number: <input value={newNumber} onChange={handleNewNumber} />
    </div>
    <div>
      {/* Botón para enviar el formulario */}
      <button type="submit">add</button>
    </div>
  </form>
);

// Componente para renderizar los detalles de una sola persona + delete button
const Person = ({ person, deletePerson }) => (
  <li>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person.id)}>delete</button>
  </li>
);
// Componente para renderizar todas las personas del directorio telefónico
const Persons = ({ persons, deletePerson  }) => (
  <ul>
    {persons.map(person => 
      // Renderiza cada persona usando el componente Person + delete
      <Person key={person.id} person={person} deletePerson={deletePerson} />
    )}
  </ul>
);

const App = () => {
  // Estado para la lista de personas
  const [persons, setPersons] = useState([]);
  // Estado para el nuevo nombre
  const [newName, setNewName] = useState('');
  // Estado para el nuevo número de teléfono
  const [newNumber, setNewNumber] = useState('');
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  //nuevo estado para error
  const [notification, setNotification] = useState({ message: null, type: null });

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);
  
  // Manejador para cambiar el nombre
  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  // Manejador para cambiar el número de teléfono
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  // Manejador para cambiar el término de búsqueda
  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  // Manejador para agregar una nueva persona
  const addPerson = (event) => {
    event.preventDefault();
    // Encontrar si la persona ya existe
    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      // Confirmar si se desea actualizar el número
      const confirmUpdate = window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`);
      
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        
        // Actualizar el número de la persona existente
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
            setNewName('');
            setNewNumber('');
            setNotification({ message: `Updated ${returnedPerson.name}'s number`, type: 'success' });
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
          })
          .catch(error => {
            setNotification({ message: `Information of ${existingPerson.name} has already been removed from server`, type: 'error' });
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
          });
      }
    } else {
      // Crear una nueva persona
      const newPerson = { name: newName, number: newNumber };

      personService.create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        })
        .catch(error => {
          setNotification({ message: 'Failed to add person', type: 'error' });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        });
    }
  };
  
  //Borra la entrada de una persona del phonebook dada la ID
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setNotification({ message: `Deleted ${person.name}`, type: 'success' });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        })
        .catch(error => {
          setNotification({ message: `Failed to delete ${person.name}`, type: 'error' });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        });
    }
  };

  // Filtra la lista de personas basado en el término de búsqueda
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      {/* Componente para Notificaciones */}
      <Notification message={notification.message} type={notification.type} />
      {/* Componente para el filtro de búsqueda */}
      <SearchFilter searchTerm={searchTerm} handleSearchTerm={handleSearchTerm} />
      {/* Componente para el formulario de agregar personas */}
      <PersonForm 
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      {/* Componente para renderizar la lista de personas filtradas */}
      <Persons persons={filteredPersons} deletePerson={deletePerson}/>
      {/* Campo de depuración para mostrar el estado actual */}
      <div>debug: {newName} {newNumber}</div>
      <CountryFilter />
    </div>
  );
};

export default App


/*//--- EJEMPLO NOTES CAMBIOS DE ESTADO BOTONES---
const App = (props) => { 
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('Nota al día') 
  const [showAll, setShowAll] = useState(true)

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true)


  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };
    setNotes(notes.concat(noteObject));
    setNewNote('');
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  return (
    <div>
      <h1>Notes</h1>
      <form onSubmit={addNote}>
        <input 
          value={newNote} 
          onChange={handleNoteChange} 
        />
        <button type="submit">Goardur</button>
      </form>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  );
}

export default App;
*/



/*----EJERCICIOS DE 2.1 HASTA 2.5----
const App = ({ courses }) => {
  return (
    <div>
      <h1>Cursos de Full Stack Open</h1>
  
      {courses.map(course => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
};

export default App;
*/
//2.1-2.5 fueron terminados 26-mayo




/*//----EJEMPLO fact from other files----
const App = (props) => {
  const { notes } = props
  const result = notes.map(note => note.id)
    console.log(result)
  note => note.id

  return (
    <div>
      <h1>Notes</h1>
      <ul>
      [{notes.map(note => 
          <Note key={note.id} note={note} />
        )}]
      </ul>
    </div>
  )
}

export default App
*/