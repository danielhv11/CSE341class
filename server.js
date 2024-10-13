const express = require('express');
const cors = require('cors');
const { connectDB } = require('./mongodb/database');
const contactsRoutes = require('./routes/contacts');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Contacts API',
            version: '1.0.0',
            description: 'API Documentation for managing contacts',
        },
        servers: [
            {
                url: 'https://cse341class-1.onrender.com', // Replace with your Render URL after deployment
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Basic route
app.get('/', (req, res) => {
    res.send('Daniel Hinojos');
});

// Use contacts routes
app.use('/contacts', contactsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong! Please try again later.');
});

// Connect to the database and start the server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database. Server not started:', err);
    });
