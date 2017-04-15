'use strict';

const redis = require('redis');

const client = redis.createClient(process.env.REDIS_URL);

client
    .on('error', function (err) {
        console.error('Redis Error', err);
    })
    .on('connect', function () {
        console.log('Redis connected');
    });

// Map containing user facebook ID as key and fantasy team ID as value
const idsMapKey = 'ids_map';

exports.storeUserFantasyTeamId = function (userId, teamId) {
    return new Promise(function (resolve, reject) {
        client.hset(idsMapKey, userId, teamId, function (err, res) {
            if (err)
                return reject(err);
            resolve();
        });
    });
};

exports.getUserFantasyTeamId = function (userId) {
    return new Promise(function (resolve, reject) {
        client.hget(idsMapKey, userId, function (err, res) {
            if (err)
                return reject(err);
            resolve(res);
        });
    });
};
