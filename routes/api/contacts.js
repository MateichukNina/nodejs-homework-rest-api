const express = require('express');
const ctrl = require('../../controllers/contacts');
const router = express.Router();
const authenticate = require("../../helpers/autorization");
const  isValidId  = require('../../helpers/isValidId');


router.get('/', authenticate, ctrl.getAll)

router.get('/:id', authenticate, isValidId, ctrl.getById)

router.post('/', authenticate, ctrl.add)

router.delete('/:id',authenticate, isValidId, ctrl.remove)

router.put('/:id', authenticate, isValidId, ctrl.update)

router.patch('/:id/favorite', authenticate, isValidId, ctrl.updateStatus)

module.exports = router;
