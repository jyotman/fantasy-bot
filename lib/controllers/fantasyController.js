/**
 * Created by jyotman on 05/11/16.
 */
'use strict';

const fantasyHelper = require('../helpers/fantasyHelper'),
    constants = require('../utils/constants');

exports.facebookVerification = function (req, res, next) {
    try {
        if (req.query['hub.verify_token'] === 'abc') {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Error, wrong validation token');
        }
    } catch (err) {
        next(err);
    }
};

exports.messageReceived = async function (req, res, next) {
    try {
        const userMessage = req.body.entry[0].messaging[0].message.text;
        const userId = res.locals.userId = req.body.entry[0].messaging[0].sender.id;
        const messageToSend = await fantasyHelper.processUserMessage(userMessage.toLowerCase(), userId);
        await fantasyHelper.sendMessage(userId, messageToSend);
        res.end();
    } catch (err) {
        // await fantasyHelper.sendMessage(res.locals.userId, 'The bot is not feeling happy right now. PLease try again later.');
        res.end();
        next(err);
    }
};