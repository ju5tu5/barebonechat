/*
https://socket.io/get-started/chat
*/
const { ifError } = require('assert')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4242

// Start het longpolling proces, geef io mee
// setInterval(callApi, 2500, io)

// const historySize = 50
// let history = []

app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
  console.log('a user connected')
  // io.emit('history', history)

  socket.on('message', (message) => {
    // while (history.length > historySize) {
    //   history.shift()
    // }
    // history.push(message)

    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

// function callApi(io) {
//   io.emit('message', 'whatever')
// }

http.listen(port, () => {
  console.log('listening on port ', port)
})
