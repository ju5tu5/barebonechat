/*
https://socket.io/get-started/chat
*/
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)

app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('message', (message) => {
    // console.log('message: ' + message)
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

http.listen(80, () => {
  console.log('listening on port 80')
})
