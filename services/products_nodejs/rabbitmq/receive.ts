#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

const queue = 'hello';
const username = 'user';
const password = 'password';
const host = 'rabbitmq';
const port = 5672;
const vhost = '/';
const connectionString = `amqp://${username}:${password}@${host}:${port}/${vhost}`;

function createRabbitMQConsumer() {
    amqp.connect(connectionString, function (error: { message: any; }, connection: { createChannel: (arg0: (error: any, channel: any) => void) => void; }) {
        if (error) {
            console.error('Error connecting to RabbitMQ:', error.message);
            return;
        }

        connection.createChannel(function (error: { message: any; }, channel: { assertQueue: (arg0: string, arg1: { durable: boolean; }) => void; consume: (arg0: string, arg1: (msg: any) => void) => void; ack: (arg0: any) => void; }) {
            if (error) {
                console.error('Error creating channel:', error.message);
                return;
            }
            
            channel.assertQueue(queue, { durable: false });

            console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
            channel.consume(queue, function (msg: { content: { toString: () => any; }; } | null) {
                if (msg !== null) {
                    console.log(' [x] Received %s', msg.content.toString());
                    channel.ack(msg); 
                }
            });
        });
    });
}

module.exports = createRabbitMQConsumer;