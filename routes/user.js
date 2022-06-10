const express = require('express');
const router = express.Router();

const UserController = require("../controllers/user.js");
const AuthUtils = require("../utils/auth.js");

router.get('/', AuthUtils.validateToken, UserController.getAllUsers);
router.post('/', UserController.createUser);

router.get('/id/:id', AuthUtils.validateToken, UserController.getUserById);
router.get('/username/:username', AuthUtils.validateToken, UserController.getUserByUsername);
router.get('/fullname/:fullname', AuthUtils.validateToken, UserController.getUserByFullname);
router.get('/phone/:phone', AuthUtils.validateToken, UserController.getUserByPhone);
router.get('/role/:name', AuthUtils.validateToken, UserController.getUsersByRoleName);
router.get('/roles/:id', AuthUtils.validateToken, UserController.getUserRoles);

router.get('/delete/:id', AuthUtils.validateToken, UserController.deleteUser);

router.put('/:id', AuthUtils.validateToken, UserController.updateUser);

router.post('/role/add', AuthUtils.validateToken, UserController.addRole);
router.post('/role/remove', AuthUtils.validateToken, UserController.removeRole);
router.post('/login', UserController.login);

router.get('/check/:email/:username', UserController.userExists);

module.exports = router;