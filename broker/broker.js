'use strict';
let config = {
  mqtt_port: 2883,
  ws_port: 8888,
  redis_port: 6379,
  redis_host: 'localhost',
  redis_db: 0,
  redis_pass:"FirstLayerBroker1%",
};

const mq = require('mqemitter-redis')({
  port: config.redis_port,
  host: config.redis_host,
  db: config.redis_db,
  family: 4  
});


const options = {
  concurrency: 100,
  heartbeatInterval: 120000, // 2 minutes
  connectTimeout: 60000, // 1 minute
  decodeProtocol: null,
  preConnect: defaultPreConnect,
  authenticate: defaultAuthenticate,
  authorizeSubscribe: defaultAuthorizeSubscribe,
  authorizePublish: defaultAuthorizePublish,
  authorizeForward: defaultAuthorizeForward,
  published: defaultPublished,
  trustProxy: false,
  trustedProxies: [],
  queueLimit: 42,
  maxClientsIdLength: 23
}

function defaultPreConnect (client, packet, callback) {
  console.log("--------------------------------")
  console.log("pre-connect", client.id, {cmd:packet.cmd, id:packet.brokerId?packet.brokerId:packet.id, topic:packet.topic})
  callback(null, true)
}

function defaultAuthenticate (client, username, password, callback) {
  console.log("Client authorized", client.id, username, password)
  callback(null, true)
}

function defaultAuthorizeSubscribe (client, sub, callback) {
  console.log("Subscription authorized", client.id, sub)
  callback(null, sub)
}

function defaultAuthorizePublish (client, packet, callback) {
  if (packet.topic.startsWith('$SYS/')) {
    return callback(new Error('$SYS/' + ' topic is reserved'))
  }
  console.log("--------------------------------")
  console.log("Publicaction authorized", client.id, {cmd:packet.cmd, brokerId:packet.brokerId?packet.brokerId:packet.id, topic:packet.topic})
  callback(null)
}

function defaultAuthorizeForward (client, packet) {
  console.log("Client packet authorized", client.id, {cmd:packet.cmd, brokerId:packet.brokerId?packet.brokerId:packet.id, topic:packet.topic})
  return packet
}

function defaultPublished (packet, client, callback) {
  console.log("Client diversification", packet)
  callback(null)
  console.log("--------------------------------")
}



let aedes = require('aedes')(options);
let server = require('net').createServer(aedes.handle);

server.listen(config.mqtt_port, function () {
  console.log('MQTT server listening on port', config.mqtt_port);
});

/*
let ws = require('websocket-stream');
ws.createServer({ server }, aedes.handle).listen(config.ws_port, function () {
  console.log('WS server listening on port', config.ws_port);
});
*/


//aedes mqtt implementation
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
  console.log('client error', client.id, err.message, err.stack);
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