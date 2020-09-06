const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const {userJoin, userLeave} = require('./users');

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.broadcast.to(user.room).emit('message', user.username + ' has join the room');

    socket.on('playing', () => {
      io.to(user.room).emit('playVideo');
    });

    socket.on('paused', () => {
      io.to(user.room).emit('pauseVideo');
    });

    socket.on('sync', (time) => {
      io.to(user.room).emit('syncVideo', time);
    });

    socket.on('change', (videoId) => {
      io.to(user.room).emit('changeVideo', videoId);
    });
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if(user){
      socket.broadcast.to(user.room).emit('message', user.username + ' has left the room');
    }
  });
});

server.listen(PORT, () => {
  console.log('Server Running');
});
