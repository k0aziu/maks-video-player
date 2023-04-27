const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = 80
const IP = '192.168.0.136'


const { google } = require('googleapis');
const fs = require('fs');




const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'your-redirect-uri';
const REFRESH_TOKEN = 'your-refresh-token';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const drive = google.drive({
  version: 'v3',
  auth: oAuth2Client,
});






const controls = {
  videoplaypause: false,
  time: 0
}

app.use('/downloads', express.static(__dirname + '/downloads'))
app.use('/data', express.static(__dirname + '/data'))

app.get('/', (req, res) => { res.sendFile(__dirname + '/player.html') })
app.get('/ui', (req, res) => { res.sendFile(__dirname + '/ui.html') })

app.use((req, res) => {
  res.status(404).send('404 Not Found')
})

io.on('connection', (socket) => {
  console.log('[] połączenie nawiązane')

  io.emit('controls', controls)

  socket.on('refreshTime', (data) => {
    controls.time = data.time
    controls.videoplaypause = data.setplaypause
  })

  socket.on('playpause', () => {
    console.log('[] odebrano zdarzenie playpause')
    controls.videoplaypause = !controls.videoplaypause
    io.emit('playpause', controls.videoplaypause)
    if (controls.videoplaypause) {
      io.emit('play')
    }
    else {
      io.emit('pause', () => {console.log('wysłałem pause')})
    }
  })

  socket.on('plus', () => {
    io.emit('plus')
  })

  socket.on('minus', () => {
    io.emit('minus')
  })

  socket.on('disconnect', (data) => {
    console.log('[] zamknięto połączenie z ' + data)
  })
})

server.listen(PORT, IP, () => {
  console.log('[] player otworzony: http://' + IP + ':' + PORT)
  console.log('[] ui otworzone: http://' + IP + ':' + PORT + '/ui')
})