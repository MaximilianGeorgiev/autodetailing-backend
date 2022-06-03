const express = require('express');
const router = express.Router();

const RoleController = require('../controllers/role');

router.route('/')
.get(RoleController.getAllRoles)
.post(RoleController.createRole);

router.get('/id/:id', RoleController.getRoleById);
router.get('/name/:name', RoleController.getRoleByName);
router.get('/delete/:id', RoleController.deleteRole); 

router.put('/:id', RoleController.updateRole);

module.exports = router;