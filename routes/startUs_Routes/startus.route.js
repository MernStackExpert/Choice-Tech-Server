const express = require('express');
const { getAllstartupMessage, addStartupMessage, updateStartupMessage, deleteStartupMessage } = require('../../controllers/startUs/startus.controller');
const verifyAdmin = require('../../middleware/verifyAdmin');
const verifyToken = require('../../middleware/verifyToken');
const router = express.Router();


router.get('/',  getAllstartupMessage);
router.post('/', addStartupMessage);
router.patch('/:id', verifyToken, verifyAdmin, updateStartupMessage);
router.delete('/:id', verifyToken, verifyAdmin, deleteStartupMessage);

module.exports = router;