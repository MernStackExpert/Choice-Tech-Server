const express = require('express');
const { getAllServices, addService, updateService, deleteService } = require('../../controllers/Services/services.controller');
const router = express.Router();


router.get('/', getAllServices);
router.post('/add', addService);
router.put('/update/:id', updateService);
router.delete('/delete/:id', deleteService);

module.exports = router;