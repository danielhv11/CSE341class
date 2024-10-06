const express = require('express');
const cors = require('cors'); // Optional: Add CORS middleware for frontend connection
const { connectDB } = require('./mongodb/database'); 
const contactsRoutes = require('./routes/contacts'); 

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json()); 

// Optional: Use CORS middleware
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.send('Daniel Hinojos');
});

// Use contacts routes for all contact-related operations
app.use('/contacts', contactsRoutes);

// Global error handling (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong! Please try again later.');
});

// Start server on specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
