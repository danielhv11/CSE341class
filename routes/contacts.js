const express = require('express');
const { ObjectId } = require('mongodb'); 
const router = express.Router();
const { getDB } = require('../mongodb/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the contact
 *         firstName:
 *           type: string
 *           description: First name of the contact
 *         lastName:
 *           type: string
 *           description: Last name of the contact
 *         email:
 *           type: string
 *           description: Email of the contact
 *         favoriteColor:
 *           type: string
 *           description: Favorite color of the contact
 *         birthday:
 *           type: string
 *           description: Birthday of the contact
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Retrieve a list of contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Contact found by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 *       400:
 *         description: Invalid contact ID format
 */
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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: All fields are required
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update an existing contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 *       400:
 *         description: All fields are required
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
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
