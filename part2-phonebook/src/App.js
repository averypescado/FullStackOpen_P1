import React, {useState, useEffect} from 'react';
import personservice from './services/persons';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [exclamationMessage, setMessage] = useState('');

  useEffect(() => {
    personservice.getAll().then((initialPeople) => {
      setPersons(initialPeople.data);
    });
  }, []);

  const searchChange = (event) => {
    setSearchName(event.target.value);
  };
  let namesToShow = [];
  namesToShow = persons.filter((person) => person.name.includes(searchName));

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addName = (event) => {
    let answer = true;
    event.preventDefault();

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    persons.forEach(function (name) {
      if (nameObject.name === name.name) {
        var response = window.confirm(
          newName +
            'has already been added to the phonebook. Replace the old number with a new one?'
        );

        if (response) {
          personservice.update(name.id, nameObject);
        }
        answer = false;
        setMessage(newName + 's number has been changed!');
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    });
    if (answer) {
      personservice.create(nameObject).then((response) => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNumber('');
      });
      setMessage(nameObject.name + 'has been added');
      setTimeout(() => {
        setMessage('');
      }, 5000);

      personservice.getAll().then((initialPeople) => {
        setPersons(initialPeople.data);
      });
    }
  };

  const handleClick = (item) => {
    var answer = window.confirm('Are you sure you want to delete?');
    if (answer) {
      axios
        .delete(`http://localhost:3001/persons/${item.id}`)
        .catch((error) => {
          setMessage(
            `the person` + item.name + ` was already deleted from server`
          );
        });
      setMessage(`the person` + item.name + ` was already deleted from server`);
    }
    personservice.getAll().then((initialPeople) => {
      setPersons(initialPeople.data);
    });
  };

  const Notification = ({message}) => {
    if (message === null) {
      return null;
    } else {
      return <div className='message'>{message}</div>;
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Notification message={exclamationMessage} />{' '}
      </div>
      Search
      <input onChange={searchChange} />
      <form onSubmit={addName}>
        <div>
          name: <input onChange={handleNameChange} />
          <div>
            number: <input onChange={handleNumberChange} />
          </div>
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {namesToShow.map((person, i) => (
          <li key={i}>
            {person && person.name} {person && person.number}{' '}
            <button onClick={handleClick.bind(this, person)}> delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
