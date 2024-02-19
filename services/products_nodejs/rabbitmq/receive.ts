#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function(error0: any, connection: { createChannel: (arg0: (error1: any, channel: any) => void) => void; }) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1: any, channel: { assertQueue: (arg0: string, arg1: { durable: boolean; }) => void; }) {
    if (error1) {
      throw error1;
    }
    var queue = 'hello';

    channel.assertQueue(queue, {
      durable: false
    });
  });
});