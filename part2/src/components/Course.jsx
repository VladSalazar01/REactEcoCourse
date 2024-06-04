import React from 'react';

// Componente que representa un curso
const Course = ({ course }) => {
  // Calcula el total de ejercicios sumando los ejercicios de todas las partes del curso
  const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <div>
      {/* Muestra el nombre del curso */}
      <h2>{course.name}</h2>
      {/* Mapea cada parte del curso y la muestra en una lista */}
      <ul>
        {course.parts.map(part => (
          <li key={part.id}>
            {part.name} {part.exercises}
          </li>
        ))}
      </ul>
      {/* Muestra el total de ejercicios del curso */}
      <p><strong>Total exercises: {totalExercises}</strong></p>
    </div>
  );
};

export default Course;
