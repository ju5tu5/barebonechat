let ioServer = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')

// State messages
const loadingState = document.querySelector('span.loading')
const emptyState = document.querySelector('span.empty')
const errorState = document.querySelector('span.offline')

// Luister naar het submit event
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()

  // Als er überhaupt iets getypt is
  if (input.value) {
    // Stuur het bericht naar de server
    ioServer.emit('message', input.value)

    // Leeg het form field
    input.value = ''
  }
})

// Luister naar de historie van de chat
ioServer.on('history', (history) => {
  // Als er geen historie is tonen we de empty state
  if (history.length === 0) {
    loadingState.style.display = 'none'
    emptyState.style.display = 'inline'

    // Er zijn berichten, haal de states weg en loop ze op het scherm
  } else {
    loadingState.style.display = 'none'
    emptyState.style.display = 'none'
    history.forEach((message) => {
      addMessage(message)
    })
  }
})

// Luister naar berichten van de server
ioServer.on('message', (message) => {
  loadingState.style.display = 'none'
  emptyState.style.display = 'none'
  addMessage(message)
})

// Er gaat iets mis bij het verbinden
ioServer.io.on('error', (error) => {
  loadingState.style.display = 'none'
  emptyState.style.display = 'none'
  errorState.style.display = 'inline'
})

// Poging om opnieuw te verbinden
ioServer.io.on('reconnect_attempt', (attempt) => {
  console.log('attempting reconnection')
})

// Verbinding geslaagd
ioServer.io.on('reconnect', (attempt) => {
  loadingState.style.display = 'none'
  emptyState.style.display = 'none'
  errorState.style.display = 'none'
})

// De server stuurt doorlopend pings om te kijken of de boel online is
ioServer.io.on('ping', () => {
  // ...
})

// Als het reconnecten niet goed gaat
ioServer.io.on('reconnect_error', (error) => {
  // ...
})

// Reconnecten is een aantal keer (reconnectionAttempts) geprobeerd en faalt
// het reconnecten stopt, misschien handig voor een 'probeer opnieuw' knop.
ioServer.io.on('reconnect_failed', () => {
  // ...
})

/**
 * Impure function that appends a new li item holding the passed message to the
 * global messages object and then scrolls the list to the last message.
 * @param {*} message the message to append
 */
function addMessage(message) {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.scrollTop = messages.scrollHeight
}
