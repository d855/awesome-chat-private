var express = require('express');
var app = express();
app.use(express.static('public'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var allUsers = [];

io.on('connection', (socket) => {
    console.log('Client with id: ' + socket.id + ' connected');

    socket.on('acceptUsername', function(username){
        allUsers.push({
            username: username,
            id: socket.id
        })
        socket.broadcast.emit('newUserJoined', username);
        io.emit('updatedUsersList', allUsers)
    })

    socket.on('message', (messageData) => {
        io.emit('newMessage', messageData);
    })


    socket.on('disconnect', function() {
        for(var i = 0; i < allUsers.length; i++){
            if(allUsers[i].id == socket.id) {
                console.log('User: ' + allUsers[i].username + ' has disconnected');
                socket.broadcast.emit('userLeft', allUsers[i].username);
                allUsers.splice(i, 1);
                io.emit('updatedUsersList', allUsers)
            }
        }
    })
})





server.listen(3000, function() {
    console.log('Server is running on port http://localhost:3000')
})