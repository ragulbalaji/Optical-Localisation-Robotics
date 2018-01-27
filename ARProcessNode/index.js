const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')

io.on('connection', socket => {
  console.log(`${socket.id} connected.`)
  socket.on('disconnect', () => console.log(`${socket.id} disconnected.`))
  socket.on('send data', data => {
    console.log(data)
  })
})

app.use('/', express.static(path.resolve('ARInputNode')))

server.listen(8080, () => {
  console.log('Listening on port 8080.')
})
