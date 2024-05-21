'use strict';

const port = process.env.PORT || 1337;

const http = require('http');
const path = require('path');
const express = require('express');
const server = express();
server.use(express.static(path.join(__dirname, '')));
server.use(express.json({limit: '10mb'}));

const engine = require('./ProbabilityEngine');

server.post('/solve', function (req, res) {
    const message = req.body;

    new Promise((resolve, reject) => {
        try {
            const result = engine.calculate(message);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    }).then(result => {
        if (result == null) {
            console.log("No reply returned from probability engine");
        }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(result));
        res.end();
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
});

http.createServer(server).listen(port, function () {
    console.log('HTTP server listening on port ' + port);
});

server.get('/', function (req, res) {
    console.log("New client attaching");
    console.log('Sending web page from ' + path.join(__dirname, 'client.html'));
    res.sendFile(path.join(__dirname, 'client.html'));
});
