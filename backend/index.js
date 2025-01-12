const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});


// Create
app.post('/todos', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO todos (title) VALUES (?)', [title], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Get All Todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get Todo by ID
app.get('/todos/:id', (req, res) => {

    const { id } = req.params; 
    const validId = id.split(':')[0];
  
    db.query('SELECT * FROM todos WHERE id = ?', [parseInt(validId)], (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.status(404).send('Todo not found');
      } else {
        res.json(result[0]);
      }
    });
  });
  

// Update
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  db.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Delete
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
