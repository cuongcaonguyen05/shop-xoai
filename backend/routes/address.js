const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/addressController');

router.get('/',           ctrl.getAddresses);
router.post('/',          ctrl.addAddress);
router.put('/:id',        ctrl.updateAddress);
router.delete('/:id',     ctrl.deleteAddress);
router.patch('/:id/default', ctrl.setDefault);

module.exports = router;
