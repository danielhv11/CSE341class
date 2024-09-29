const express = require('express');
const { ObjectId } = require('mongodb'); 
const router = express.Router();
const { getDB } = require('../mongodb/database'); 

// GET all contacts
router.get('/', async (req, res) => {
    try {
        const db = getDB(); 
        const contacts = await db.collection('Contacts').find().toArray();
        res.json(contacts);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// GET a single contact by ID
router.get('/:id', async (req, res) => {
    try {
        const db = getDB(); 
        const contactId = req.params.id; 
        const contact = await db.collection('Contacts').findOne({ _id: new ObjectId(contactId) }); 

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        
        res.json(contact); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Export the router
module.exports = router;
