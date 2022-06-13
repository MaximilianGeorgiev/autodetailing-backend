const express = require('express');
const router = express.Router();

const RoleController = require('../controllers/role');
const AuthUtils = require("../utils/auth.js");

router.get('/', RoleController.getAllRoles);
router.post('/', AuthUtils.validateToken, RoleController.createRole);

router.get('/id/:id', RoleController.getRoleById);
router.get('/name/:name', RoleController.getRoleByName);
router.get('/delete/:id', AuthUtils.validateToken, RoleController.deleteRole); 

router.put('/:id', AuthUtils.validateToken, RoleController.updateRole);

module.exports = router;