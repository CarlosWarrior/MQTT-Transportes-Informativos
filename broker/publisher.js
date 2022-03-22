'use strict'

const mqtt = require('mqtt')

const clientId = 'MQTTPublisher'

//const host = 'mqtt://localhost:2883'

const host = 'mqtt://ec2-3-15-19-31.us-east-2.compute.amazonaws.com:2883'

const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: false,
  reconnectPeriod: 1000 * 5,
  connectTimeout: 1000 * 30,
  retain: true,
  will: {
    topic: 'WillMsg',
    payload: 'Publisher connection Closed abnormally..!',
    qos: 1,
    retain: false
  }
}


const client = mqtt.connect(host, options)

function loop() {
  const d = new Date()
  const msg = d.toString()
  client.publish('TOPIC_MQTT', msg, { qos: 1, retain: false })
  console.log(clientId, msg)
}

client.on('error', function (err) {
  console.log(err)
  client.end()
})

client.on('connect', function () {
  console.log('client connected:' + clientId)
})

setInterval(loop, 15000)

client.on('message', function (topic, message, packet) {
  console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
})

client.on('close', function () {
  console.log(clientId + ' disconnected')
})