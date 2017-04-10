/**
 * Created by jyotman on 05/11/16.
 */
'use strict';

const express = require('express'),
    router = express.Router(),
    fantasyController = require('../lib/controllers/fantasyController');

router.get('/', fantasyController.facebookVerification);

router.post('/', fantasyController.messageReceived);

module.exports = router;