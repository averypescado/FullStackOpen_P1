import React from 'react';

const Course = props => {
  const {course} = props;
  const classlist = course.parts;
  var total = classlist.reduce(function(sum, order) {
    return sum + order.exercises;
  }, 0);

  return (
    <div>
      <h1> {course.name}</h1>
      <div className='content'>
        <ul>
          {' '}
          {classlist.map(course => (
            <li key={course.id}>
              {' '}
              {course.name} {course.exercises}
            </li>
          ))}
        </ul>
      </div>
      Total {total}
    </div>
  );
};
export default Course;
