const express = require('express');
const router = express.Router();

const UserController = require("../controllers/user.js");

router.route('/')
.get(UserController.getAllUsers)
.post(UserController.createUser);

router.get('/id/:id', UserController.getUserById);
router.get('/username/:username', UserController.getUserByUsername);
router.get('/fullname/:fullname', UserController.getUserByFullname);
router.get('/phone/:phone', UserController.getUserByPhone);
router.get('/role/:name', UserController.getUsersByRoleName);
router.get('/roles/:id', UserController.getUserRoles);

router.get('/delete/:id', UserController.deleteUser); 

router.put('/:id', UserController.updateUser);

router.post('/role/add', UserController.addRole);
router.post('/role/remove', UserController.removeRole);
router.post('/login', UserController.login);

module.exports = router;