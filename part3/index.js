const express = require('express');

const app = express();
app.use(express.json());
const cors = require('cors')

app.use(cors())

let people = [{
    name: 'Donnie Trumpet',
    number: '1-234-2342',
    id: 1,
  },
  {
    name: 'Chance the Rapper',
    number: '2-2345-2342',
    id: 2,
  },
  {
    name: 'Vic Mensa',
    number: '3-45345-2342',
    id: 3,
  },
  {
    name: 'Bob Bobber',
    number: '4-345-23423',
    id: 4,
  },
];

app.get('/', (req, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/people', (req, response) => {
  console.log("this is the get")
  response.json(people);
});

app.get('/api/info', (req, response) => {
  response.send(`<p>Phonebook has info for ${people.length} people</p>
  <p>${new Date()}</p>`);
});

app.get('/api/people/:id', (request, response) => {
  console.log("this is the get")
  const id = Number(request.params.id);
  const person = people.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/people/:id', (request, response) => {
  console.log("This is the delete")
  const id = Number(request.params.id);
  people = people.filter((person) => person.id !== id);
  response.status(204).end()
});


const generateId = () => {
  const ID = parseInt(Math.random() * 100000000, 10)
  return ID
}

app.post('/api/people', (request, response) => {
  const body = request.body
  console.log(body.content)
  if (!body.name) {
    return response.status(400).json({
      errorMessage: 'Name is required'
    })
  }
  let duplicate = false

  function myFunction(person) {
    if (person.name === body.name) {
      duplicate = true
    }
    return duplicate
  }

  people.forEach(myFunction);

  if (duplicate) {
    return response.status(400).json({
      errorMessage: `Name must be unique`
    })
  }

  if (!body.number) {
    return response.status(400).json({
      errorMessage: 'Number is required'
    })
  }


  const person = {
    name: body.name,
    number: body.number || false,
    id: generateId(),
  }

  people = people.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});