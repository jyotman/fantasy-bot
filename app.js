'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    debug = require('debug'),
    path = require('path'),
    http = require('http'),
    favicon = require('serve-favicon');

const app = express();
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

const appRouter = require('./routes/appRouter');
const fantasyRouter = require('./routes/fantasyRouter');

app.use('/', appRouter);
app.use('/fantasy', fantasyRouter);

// catch 404
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// default error handler
app.use(function (err, req, res, next) {
    console.error('Error Handler', err);
    if (!res.headersSent)
        res.status(err.status || 500).send({error: err.message});
});

process.on('unhandledRejection', (err) => {
    console.error(err);
    console.error('\n-----------------------EXITING PROCESS-----------------------\n');
    process.exit(1);
});

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/**
 * Event listener for HTTP server "error.pug" event.
 */
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port))
        return val;
    if (port >= 0)
        return port;
    return false;
}