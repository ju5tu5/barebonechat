/* Losjes gebaseerd op https://socket.io/get-started/chat */

import * as path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'

const app = express()
const http = createServer(app)
const ioServer = new Server(http, {
  connectionStateRecovery: {
    // De tijdsduur voor recovery bij disconnect
    maxDisconnectionDuration: 2 * 60 * 1000,
    // Of middlewares geskipped moeten worden bij recovery (ivm login)
    skipMiddlewares: true,
  },
})
const port = process.env.PORT || 4242
const historySize = 50

let history = []

// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))

// Start de socket.io server op
ioServer.on('connection', (client) => {
  // Log de connectie naar console
  console.log(`user ${client.id} connected`)

  // Stuur de history
  client.emit('history', history)

  // Luister naar een message van een gebruiker
  client.on('message', (message) => {
    // Check de maximum lengte van de historie
    while (history.length > historySize) {
      history.shift()
    }
    // Voeg het toe aan de historie
    history.push(message)

    // Verstuur het bericht naar alle clients
    ioServer.emit('message', message)
  })

  // Luister naar een disconnect van een gebruiker
  client.on('disconnect', () => {
    // Log de disconnect
    console.log(`user ${client.id} disconnected`)
  })
})

// Start een http server op het ingestelde poortnummer en log de url
http.listen(port, () => {
  console.log('listening on http://localhost:' + port)
})
