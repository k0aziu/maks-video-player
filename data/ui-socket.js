const socket = io('ws://192.168.0.136:80')

socket.on('connect', () => {
  console.log('[] otwarto połączenie')
  socket.send('init')
})

socket.on('disconnect', (data) => {
  data = "ui"
  console.log('[] zamknięto połączenie')
})

kontroler = document.getElementById("kontroler")
playpause = document.getElementById("playpause")
wstecz = document.getElementById("wstecz")
naprzod = document.getElementById("naprzod")

play = false
time = 0

playpause.onclick = () => {
  socket.emit('playpause', () => {
    console.log('[] play')
  })
  console.log("play clicked")
}

wstecz.onclick = () => { //TODO
  socket.emit('minus', () => {
    console.log('[] minus')
  })
}

naprzod.onclick = () => { //TODO
  socket.emit('plus', () => {
    console.log('[] plus')
  })
}

socket.on('playpause', (data) => {
  play = data
  playpause.innerHTML = data ? "Stop" : "Play"
  console.log("set " + data);
})