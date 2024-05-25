//----EJERCICIOS DE 1.6 hasta 1.14-----
import { useState } from 'react';

// Componente para el botón
const Button = (props) => {
  console.log(props);
  const { handleClick, text } = props;
  return (
    <li><button onClick={handleClick}>
    {text}
    </button></li>
  );
};

// Componente para mostrar una única estadística
const StatisticLine = (props) => {
  const { text, value } = props;
  return (
    <div>
      {text} {value}
    </div>
  );
};

const App = () => {
  // Estados para las valoraciones
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  // Estados para los clics y estadísticas
  const [allClicks, setAll] = useState([]);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  // Función para actualizar las estadísticas
  const updateStatistics = (updatedGood, updatedNeutral, updatedBad) => {
    const newTotal = updatedGood + updatedNeutral + updatedBad;
    const newAverage = newTotal ? (updatedGood - updatedBad) / newTotal : 0;
    const newPositive = newTotal ? (updatedGood / newTotal) * 100 : 0;

    setTotal(newTotal);
    setAverage(newAverage);
    setPositive(newPositive);
  };

  // Manejadores de eventos para cada tipo de clic
  const handleGood = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    setAll(allClicks.concat('G'));
    updateStatistics(updatedGood, neutral, bad);
  };

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1;
    setNeutral(updatedNeutral);
    setAll(allClicks.concat('N'));
    updateStatistics(good, updatedNeutral, bad);
  };

  const handleBad = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);
    setAll(allClicks.concat('B'));
    updateStatistics(good, neutral, updatedBad);
  };

  // Componente para mostrar todas las estadísticas
  const Statistics = (props) => {
    const { good, neutral, bad, total, average, positive } = props;
    return (
      <div>
        <h1>Estadísticas</h1>
        <StatisticLine text="Buenos" value={good} />
        <StatisticLine text="Neutros" value={neutral} />
        <StatisticLine text="Malos" value={bad} />
        <StatisticLine text="Total" value={total} />
        <StatisticLine text="Promedio" value={average} />
        <StatisticLine text="Porcentaje positivo" value={`${positive} %`} />
      </div>
    );
  };

  return (
    <div>
      <h1>Dar Retroalimentación</h1>
      <Button handleClick={handleGood} text='Buenos' />
      <Button handleClick={handleNeutral} text='Neutrales' />
      <Button handleClick={handleBad} text='Malos' />
      {/* Renderizar estadísticas solo si hay al menos un comentario */}
      {total > 0 && (
        <Statistics 
          good={good} 
          neutral={neutral} 
          bad={bad} 
          total={total} 
          average={average} 
          positive={positive} 
        />
      )}
    </div>
  );
};

export default App;


/* ----EJERCICIOS DE 1.1 HASTA 1.5----

import React from 'react';

// Componente Header: muestra el nombre del curso
const Header = ({ course }) => {
  console.log(course)
  return <h1>{course}</h1>;
};

// Componente Part: muestra una parte del curso y el número de ejercicios (parte de Content)
const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

// Componente Content: muestra todas las partes del curso
// Componente Content: muestra los tres componentes Part
const Content = ({ parts }) => {
  return (
    <div>
      <Part part={parts[0].name} exercises={parts[0].exercises} />
      <Part part={parts[1].name} exercises={parts[1].exercises} />
      <Part part={parts[2].name} exercises={parts[2].exercises} />
    </div>
  );
};

// Componente Total: muestra el número total de ejercicios
const Total = ({ exercises }) => {
  const totalExercises = exercises.reduce((sum, exercises) => sum + exercises, 0);
  return <p>Number of exercises {totalExercises}</p>;
};

// Componente App: componente principal que pasa los datos a los componentes hijos
const App = () => {
  // Datos del curso y sus partes
  const course = 'Half Stack application development';
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10,
    },
    {
      name: 'Using props to pass data',
      exercises: 7,
    },
    {
      name: 'State of a component',
      exercises: 14,
    },
  ];
  
  // Renderiza el componente principal con los componentes hijos
  return (
  
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total exercises={parts.map(part => part.exercises)} />
    </div>
  );
};


export default App;


*/