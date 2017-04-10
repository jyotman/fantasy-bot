/**
 * Created by jyot on 8/4/17.
 */

'use strict';

/**
 * @param {String} message
 * @param {Number} [statusCode]
 */
exports.createError = function (message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
};