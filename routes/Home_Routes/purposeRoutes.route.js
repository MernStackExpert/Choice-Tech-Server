const express = require('express');
const router = express.Router();
const { 
  getAllPurposes, 
  addPurpose, 
  updatePurpose, 
  deletePurpose 
} = require('../../controllers/Home/purpose.controller');

router.get('/', getAllPurposes);
router.post('/add', addPurpose);
router.put('/update/:id', updatePurpose);
router.delete('/delete/:id', deletePurpose);

module.exports = router;