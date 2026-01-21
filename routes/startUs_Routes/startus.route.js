const express = require('express');
const { getAllstartupMessage, addStartupMessage, updateStartupMessage, deleteStartupMessage } = require('../../controllers/startUs/startus.controller');
const router = express.Router();


router.get('/', getAllstartupMessage);
router.post('/', addStartupMessage);
router.patch('/:id', updateStartupMessage);
router.delete('/:id', deleteStartupMessage);

module.exports = router;