/* Losjes gebaseerd op https://socket.io/get-started/chat */

import * as path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'

const app = express()
const http = createServer(app)
const io = new Server(http)
const port = process.env.PORT || 4242
// const apiUrl = 'https://whois.fdnd.nl/api/v1/squad?id=cldcspecf0z0o0bw59l8bwqim'

const historySize = 50

let history = []
let membersLoaded = false
let htmlMemberList = null

// Start het longpolling proces, geef io mee als parameter
// setInterval(longPollExample, 2500, io)

// Voorbeeld waarbij API data met filter, map en reduce wordt vertaald naar HTML
// fetchJson(apiUrl).then((data) => {
//   // doe hier iets nuttigs met de data..
//   htmlMemberList = renderMembers(data.squad.members)
//   membersLoaded = true
//   console.log(htmlMemberList)
// })

// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))

io.on('connection', (socket) => {
  // Log de connectie naar console
  console.log('a user connected')
  // Stuur de historie door, let op: luister op socket, emit op io!
  io.emit('history', history)

  // Luister naar een message van een gebruiker
  socket.on('message', (message) => {
    // Check de maximum lengte van de historie
    while (history.length > historySize) {
      history.shift()
    }
    // Voeg het toe aan de historie
    history.push(message)
    // Verstuur het bericht naar alle clients
    io.emit('message', message)
  })

  // Luister naar een disconnect van een gebruiker
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

// Start een http server op het ingestelde poortnummer en log de url
http.listen(port, () => {
  console.log('listening on http://localhost:' + port)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
// async function fetchJson(url) {
//   return await fetch(url)
//     .then((response) => response.json())
//     .catch((error) => error)
// }

/**
 * Renders the passed memberList to an HTML representation using the holy trinity
 * of functional programming: filter, map and reduce.
 * @param {*} memberList a list of members from the whois API
 * @returns an HTML output of the memberlist.
 */
function renderMembers(memberList) {
  return memberList
    .filter((member) => member.role.includes('student'))
    .map((member) => renderMember(member))
    .reduce((output, member) => output + member)
}

/**
 * Renders a passed member object to HTML
 * @param {*} member a single member object from the whois API
 * @returns an HTML output of the member
 */
function renderMember(member) {
  return `
    <article>
      <h2>${member.name}</h2>
      <p>${member.bio ? member.bio.html : ''}</p>
    </article>
  `
}

/**
 * Demonstrates a longpolling process, io is passed along to prevent side-effects
 * @param {*} io a reference to socket.io used to send a message.
 */
function longPollExample(io) {
  io.emit('whatever', 'somebody set up us the bomb!')
}
