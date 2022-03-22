'use strict'

const mqtt = require('mqtt')

const clientId = 'MQTTSubscriber'

//const host = 'mqtt://localhost:2883'
const host = 'mqtt://ec2-3-15-19-31.us-east-2.compute.amazonaws.com:2883'

const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: false,
  retain: false,
  reconnectPeriod: 1000 * 3,
  connectTimeout: 1000 * 30,
  will: {
    topic: 'WilllMsg',
    payload: 'Subscriber Connection Closed abnormally..!',
    qos: 1,
    retain: false
  }
}

const mqttclient = mqtt.connect(host, options)

const logSubscription = (err, data) => {
  console.log("Subscribed: ", {err, data})
}

mqttclient.on('connect', function () {
  console.log('%s mqtt client connected', clientId)
  mqttclient.subscribe('TOPIC_MQTT', logSubscription)
})


mqttclient.on('error', function (err, data) {
  console.log(err, data)
  mqttclient.end()
})

mqttclient.on('message', function (topic, message, packet) {
  console.log('%s Rec: %s Topic: %s', clientId, message.toString(), topic) 
  //
})

mqttclient.on('offline', function () {
  console.log('offline')
})

mqttclient.on('close', function () {
  console.log(clientId + ' disconnected')
})

mqttclient.on('reconnect', function () {
  console.log('reconnected: ', clientId)
})