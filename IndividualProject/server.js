const express = require('express');
const app = express();
const { connectDB } = require('./mongodb/database'); 
const contactsRoutes = require('./routes/contacts'); 

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json()); 

// Root route
app.get('/', (req, res) => {
  res.send('Daniel Hinojos');
});

// Use contacts routes
app.use('/contacts', contactsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
