const express = require('express');
const { getAllContactMessage, addContactMessage, updateContactMessage, deleteContactMessage } = require('../../controllers/Contact/contactForm.controller');
const verifyAdmin = require('../../middleware/verifyAdmin');
const verifyToken = require('../../middleware/verifyToken');
const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllContactMessage);
router.post('/', addContactMessage);
router.patch('/:id', verifyToken, verifyAdmin, updateContactMessage);
router.delete('/:id', verifyToken, verifyAdmin, deleteContactMessage);

module.exports = router;