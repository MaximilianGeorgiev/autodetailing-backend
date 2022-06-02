const express = require('express');
const router = express.Router();

const RoleController = require('../controllers/role');

router.get('/', RoleController.getAllRoles);
router.get('/id/:id', RoleController.getRoleById);
router.get('/name/:name', RoleController.getRoleByName);

router.post('/', RoleController.createRole);
router.put('/', RoleController.updateRole);

module.exports = router;