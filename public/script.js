let socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()
  if (input.value) {
    socket.emit('message', input.value)
    input.value = ''
  }
})

socket.on('connect', () => {
  console.log('Connected', socket.id) // x8WIv7-mJelg7on_ALbx
})

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    console.log('Disconnection initiated by the server, reconnecting..')
    socket.connect()
  }
  console.log('Lost connection.. Reconnecting..')
})

socket.io.on('reconnect_attempt', () => {
  console.log('Reconnection attempt!')
})

socket.on('reconnect', () => {
  console.log('Reconnected', socket.id)
})

socket.on('message', (message) => {
  addMessage(message)
})

socket.on('whatever', (message) => {
  addMessage(message)
})

socket.on('history', (history) => {
  history.forEach((message) => {
    addMessage(message)
  })
})

function addMessage(message) {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.scrollTop = messages.scrollHeight
}
