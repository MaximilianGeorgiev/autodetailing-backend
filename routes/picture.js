const express = require('express');
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });


const PictureController = require('../controllers/picture.js');

router.post("/add", upload.array("pictures"), PictureController.addPicture);

module.exports = router;