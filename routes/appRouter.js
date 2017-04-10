const express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.json({title: 'Express live bro!'});
});

module.exports = router;