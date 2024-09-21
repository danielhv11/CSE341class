const express = require('express');
const app = express();

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to my CSE341class web server!');
});

// Existing route
app.get('/name', (req, res) => {
  res.send('John Doe'); // Replace with the name of someone you know
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
