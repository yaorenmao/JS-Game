//aka server
const express = require('express');
const app = express();
const port = 3000;
const server = app.listen(port);
const io = require('socket.io')(server);


//Hello World line taken from the express website
app.get('/', (req, res) =>
    {
        res.send('Hello World!');
    });



io.on('connection', (socket)=>
{
    console.log('a user connected');
    //Sending a message to the client only
    socket.emit('serverToClient', "Hello, client!");///TO SENDER
    //Просто получение даты от клиента и действия с ней
    socket.on('clientToServer', data => {
        console.log(data);
    });
    //When the client sends a message via the 'clientToClient' event
    //Сервер пересылает дату всем кроме пославшего её клиента
    socket.on('clientToClient', data => {
        socket.broadcast.emit('serverToClient', data);///TO ALL BUT SENDER
    });
    //io.emit('test', 'Hello');//sends Hello to everyone including self
});


//taskkill /F /IM node.exe