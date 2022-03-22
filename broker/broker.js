'use strict';
let config = {
  mqtt_port: 2883,
  ws_port: 8888,
  redis_port: 6379,
  redis_host: 'localhost',
  redis_db: 0,
};

const mq = require('mqemitter-redis')({
  port: config.redis_port,
  host: config.redis_host,
  db: config.redis_db,
  family: 4  
});
/*

const persistence = require('aedes-persistence-redis')({
  port: config.redis_port,
  host: config.redis_host,
  family: 4,
  db: config.redis_db,
  maxSessionDelivery: 6000
});

let aedesOptions = {mq, persistence, concurrency: 200};
*/


let aedes = require('aedes')()//(aedesOptions);
let server = require('net').createServer(aedes.handle);

server.listen(config.mqtt_port, function () {
  console.log('MQTT server listening on port', config.mqtt_port);
});


aedes.on('client', function (client) {
  console.log('new client', client.id);
});

aedes.on('connackSent', function (client) {
  console.log('sent connack to %s', client);
});

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('%s subscribe %s', client.id, subscriptions.map(s => JSON.stringify(s)));
  }
});

aedes.on('clientError', function (client, err) {
  console.log('client error', client.clientId, err.message, err.stack);
});

aedes.on('connectionError', function (client, err) {
  console.log('client error: client: %s, error: %s', client.clientId, err.message);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('%s : topic %s : %s', client.id, packet.topic, packet.payload);
  }
});

aedes.on('ack', function (message, client) {
  console.log('%s ack\'d message', client.id);
});

aedes.on('clientDisconnect', function (client) {
  console.log('%s disconnected', client.id);
});