const express = require('express');
const router = express.Router();
const { 
  getAllTryFree, 
  addTryFree, 
  updateTryFree, 
  deleteTryFree 
} = require('../../controllers/Home/tryFree.controller');

router.get('/', getAllTryFree);
router.post('/add', addTryFree);
router.put('/update/:id', updateTryFree);
router.delete('/delete/:id', deleteTryFree);

module.exports = router;