const express = require('express');
const { getAllContactMessage, addContactMessage, updateContactMessage, deleteContactMessage } = require('../../controllers/Contact/contactForm.controller');
const router = express.Router();

router.get('/', getAllContactMessage);
router.post('/', addContactMessage);
router.patch('/:id', updateContactMessage);
router.delete('/:id', deleteContactMessage);

module.exports = router;