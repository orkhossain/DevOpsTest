#!/usr/bin/env node

const amqp = require('amqplib/callback_api');
const express = require('express');
const router = express.Router();
const queue = 'hello';
const username = 'user';
const password = 'password';
const host = 'rabbitmq';
const port = 5672;
const vhost = '/';
const connectionString = `amqp://${username}:${password}@${host}:${port}/${vhost}`;

router.post('/', express.json(), function (req, res, next) {
    const message = req.body.message;
    if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
    }

    amqp.connect(connectionString, function (error, connection) {
        if (error) {
            console.error('Error connecting to RabbitMQ:', error.message);
            res.status(500).json({ error: 'Failed to connect to RabbitMQ' });
            return;
        }

        connection.createChannel(function (error, channel) {
            if (error) {
                console.error('Error creating channel:', error.message);
                res.status(500).json({ error: 'Failed to create channel' });
                return;
            }

            channel.sendToQueue(queue, Buffer.from(message));
            console.log(' [x] Sent %s', message);
            res.status(200).json({ message: 'Message sent successfully' });
        });
    });
});

module.exports = router;
