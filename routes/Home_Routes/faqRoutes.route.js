const express = require('express');
const { getAllFAQs, addFAQ, updateFAQ, deleteFAQ } = require('../../controllers/Home/faqQuestion.controller');
const router = express.Router();


router.get('/', getAllFAQs);
router.post('/add', addFAQ);
router.put('/update/:id', updateFAQ);
router.delete('/delete/:id', deleteFAQ);

module.exports = router;