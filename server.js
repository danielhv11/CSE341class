const express = require('express');
const app = express();

// Create a route that returns someone's name
app.get('/name', (req, res) => {
  res.send('Emily Hinojos'); // Replace with the name of someone you know
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
