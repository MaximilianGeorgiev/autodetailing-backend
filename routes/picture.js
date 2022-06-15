const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
     },
    });

const upload = multer({ storage: storage });

const PictureController = require('../controllers/picture.js');

router.post("/add", upload.array("pictures"), PictureController.addPicture);

module.exports = router;