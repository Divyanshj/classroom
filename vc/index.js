const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3001;
const path = require('path');

let socketList = {};

app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname,'./client/build/index.html'))
})



io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    socket.disconnect();
  });

  socket.on('checkUser', ({ roomID, userName }) => {
    io.sockets.in(roomID).clients((err, clients) => {
      socket.emit('errorUserExists', {clients, userName, socketList});
    });
  });

  socket.on('joinRoom', ({ roomID, userName }) => {
    socket.join(roomID);
    socketList[socket.id] = { userName, video: true, audio: true };

    io.sockets.in(roomID).clients((err, clients) => {
        socket.broadcast.to(roomID).emit('userJoin', {clients, socketList});
    });
  });

  socket.on('callUser', ({ userToCall, from, signal }) => {
    io.to(userToCall).emit('receiveCall', { signal, from, info: socketList[socket.id] });
  });

  socket.on('acceptCall', ({ signal, to }) => {
    io.to(to).emit('callAccepted', { signal, answerId: socket.id });
  });

  socket.on('sendMessage', ({ roomID, msg, sender }) => {
    io.sockets.in(roomID).emit('receiveMessage', { msg, sender });
  });

  socket.on('leaveRoom', ({ roomID }) => {
    socket.broadcast.to(roomID).emit('userLeave', { userId: socket.id });
  });

  socket.on('finish',({roomID}) => {
    delete socketList[socket.id];
    io.sockets.sockets[socket.id].leave(roomID);
  })

  socket.on('toggle', ({ roomID, switchTarget }) => {
    if (switchTarget === 'video') {
      socketList[socket.id].video = !socketList[socket.id].video;
    } else {
      socketList[socket.id].audio = !socketList[socket.id].audio;
    }
    socket.broadcast.to(roomID).emit('toggleVideo', { userId: socket.id, switchTarget });
  });
});

server.listen(PORT, () => {
  console.log('Connected : '+ PORT);
});
