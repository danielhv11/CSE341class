const express = require('express');
const { ObjectId } = require('mongodb'); 
const router = express.Router();
const { getDB } = require('../mongodb/database');

// GET all contacts
router.get('/', async (req, res) => {
    try {
        const db = getDB(); 
        const contacts = await db.collection('Contacts').find().toArray(); 
        res.status(200).json(contacts); 
    } catch (error) {
        console.error('Error fetching contacts:', error); 
        res.status(500).json({ message: 'Failed to retrieve contacts', error: error.message });
    }
});

// GET a single contact by ID
router.get('/:id', async (req, res) => {
    const contactId = req.params.id;

    if (!ObjectId.isValid(contactId)) {
        return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    try {
        const db = getDB(); 
        const contact = await db.collection('Contacts').findOne({ _id: new ObjectId(contactId) });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact by ID:', error); 
        res.status(500).json({ message: 'Failed to retrieve contact', error: error.message });
    }
});

// POST - Create a new contact
router.post('/', async (req, res) => {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = getDB();
        const newContact = {
            firstName,
            lastName,
            email,
            favoriteColor,
            birthday
        };
        const result = await db.collection('Contacts').insertOne(newContact);
        res.status(201).json({ message: 'Contact created successfully', contactId: result.insertedId });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Failed to create contact', error: error.message });
    }
});

// PUT - Update a contact
router.put('/:id', async (req, res) => {
    const contactId = req.params.id;

    if (!ObjectId.isValid(contactId)) {
        return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = getDB();
        const updatedContact = {
            $set: {
                firstName,
                lastName,
                email,
                favoriteColor,
                birthday
            }
        };

        const result = await db.collection('Contacts').updateOne({ _id: new ObjectId(contactId) }, updatedContact);
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact updated successfully' });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Failed to update contact', error: error.message });
    }
});

// DELETE - Delete a contact
router.delete('/:id', async (req, res) => {
    const contactId = req.params.id;

    if (!ObjectId.isValid(contactId)) {
        return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    try {
        const db = getDB();
        const result = await db.collection('Contacts').deleteOne({ _id: new ObjectId(contactId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Failed to delete contact', error: error.message });
    }
});

module.exports = router;
