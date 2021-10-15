var app = require("express")();
var mysql = require("mysql");
var http = require('http').Server(app);
var io = require("socket.io")(http);

/* Creating POOL MySQL connection.*/

var pool = mysql.createConnection({
host     : '127.0.0.1',
user     : 'root',
password : '',
database : 'eduportal'
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {
    console.log("A user is connected");
        get_cs_name(function(res,cs_name) {
            if (res) {
                io.emit('get_cs_name', cs_name);
            } else {
                io.emit('error');
            }
        });
});

var get_cs_name = function(callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            callback(false);
            return;
        }
        connection.query("SELECT cs_name FROM course_master where cs_id = 4", function(err, rows) {
            connection.release();
            if (!err) {
                callback(true,rows[0].cs_name);
            }
        });
        connection.on('error', function(err) {
            callback(false,null);
        });
    });
}

http.listen(3000, function() {
    console.log("Listening on 3000");
});