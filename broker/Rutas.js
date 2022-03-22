const http = require('http')
const createError = require('http-errors')
const express = require('express')
require('./broker')
//www access
const port = 3003
const app = express()
app.set('port', port)
const routes = express.Router()
  .get('/', (req, res) => res.send("Hello World"))
  .post('/', (req, res) => req.body && res.send({body}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', routes)
app.use( (req, res, next) => next(createError(404)) )
app.use( (err, req, res, next) => res.satus(this.error.statusCode || this.error.status).send({err}) )


const server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
}
//npm install mqemitter-redis aedes aedes-persistence-redis express mqtt