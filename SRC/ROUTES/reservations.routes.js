const express = require('express')
const router = express.Router()

// reservations from an apparment with id
router.post('/:id/reservations');
router.get('/:id/reservations');

// reservations with an id form an appartment with id
router.get('/:id/reservations/:id');
router.put('/:id/reservations/:id');
router.delete('/:id/reservations/:id');




module.exports = router