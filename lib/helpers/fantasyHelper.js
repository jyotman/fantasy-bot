/**
 * Created by jyot on 8/4/17.
 */
'use strict';

const redis = require('../tools/redis'),
    request = require('request'),
    utils = require('../utils/utils'),
    constants = require('../utils/constants');

exports.processUserMessage = async function (message, userId) {
    if (message === 'score') {
        const teamId = await redis.getUserFantasyTeamId(userId);
        if (teamId === null)
            return 'You are not logged in!';
        return getTotalPoints(teamId);
    }
    else if (message.startsWith('login')) {
        const teamId = message.split(' ')[1];
        if (teamId === undefined || !Number.isInteger(parseInt(teamId)))
            return 'Please provide fantasy ID in the format "login xxxxxx" where "xxxxxx" is you teams\'s ID.\n\nTo know your team\'s ID, visit - https://fantasy-bot.herokuapp.com';
        await redis.storeUserFantasyTeamId(userId, teamId);
        return constants.loginText;
    }
    else if (message === 'rank') {
        const teamId = await redis.getUserFantasyTeamId(userId);
        if (teamId === null)
            return 'You are not logged in!';
        return getLeagueRankings(teamId);
    }
    else if (message === 'help') {
        return constants.commands;
    }
    else
        return constants.invalidCommand;
};

exports.sendMessage = function (userId, text) {
    return new Promise(function (resolve, reject) {
        const options = {
            url: 'https://graph.facebook.com/v2.8/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN,
            body: {
                recipient: {
                    id: userId
                },
                message: {
                    text: text
                }
            },
            json: true
        };
        request.post(options, function (err, res, body) {
            if (err)
                reject(err);
            else if (res.statusCode >= 400)
                reject(body);
            else
                resolve(body);
        });
    });
};

function getFantasyTeamData(teamId) {
    return new Promise(function (resolve, reject) {
        const options = {
            url: `https://fantasy.premierleague.com/api/entry/${teamId}/`,
            json: true
        };
        request(options, function (err, res, body) {
            if (err)
                reject(err);
            else if (res.statusCode !== 200)
                resolve('Your fantasy team ID is invalid. Please login again using a valid ID.');
            else
                resolve(body);
        });
    });
}

async function getTotalPoints(teamId) {
    const teamData = await getFantasyTeamData(teamId);
    if (typeof teamData === 'string')
        return teamData;
    return 'Current Score - ' + teamData.summary_event_points;
}

async function getLeagueRankings(teamId) {
    const teamData = await getFantasyTeamData(teamId);
    if (typeof teamData === 'string')
        return teamData;
    return teamData.leagues.classic.map(league => league.name + " - " + league.entry_rank).join('\n');
}