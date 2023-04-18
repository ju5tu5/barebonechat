/*
https://socket.io/get-started/chat
*/

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const port = process.env.PORT || 4242

// Start het longpolling proces, geef io mee
// setInterval(callApi, 2500, io)

const historySize = 50
let history = []

// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
  console.log('a user connected')
  io.emit('history', history)

  socket.on('message', (message) => {
    while (history.length > historySize) {
      history.shift()
    }
    history.push(message)

    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

function callApi(io) {
  io.emit('whatever', 'somebody set up us the bomb!')
}

http.listen(port, () => {
  console.log('listening on http://localhost:' + port)
})
