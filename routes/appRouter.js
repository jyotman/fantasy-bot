const express = require('express'),
    appController = require('../lib/controllers/appController'),
    router = express.Router();

/* GET home page. */
router.get('/', appController.getHome);

module.exports = router;