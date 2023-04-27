const video = document.querySelector('#player')

const socket = io('ws://192.168.0.136:80')

setplaypause = false

socket.on('connect', () => {
  console.log('[] otwarto połączenie')
})

socket.on('controls', (controls) => {
  console.log('przed ' + video.currentTime)
  video.currentTime = controls.time
  console.log('po ' + video.currentTime)
  controls.videoplaypause ? video.play() : video.pause()
})

setInterval(() => {
  socket.emit('refreshTime', { time: video.currentTime, setplaypause: setplaypause })
  console.log("refresh")
}, 5000);

socket.on('play', () => {
  console.log('play');
  setplaypause = true
  video.play()
})

socket.on('pause', () => {
  console.log('stop');
  setplaypause = false
  video.pause()
})

socket.on('plus', () => {
  console.log('plus')
  video.currentTime += 15;
})

socket.on('minus', () => {
  console.log('minus')
  video.currentTime -= 15;
})

socket.on('disconnect', (data) => {
  data = "player"
  console.log('[] zamknięto połączenie')
})