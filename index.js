var noble = require('noble');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//BLE moules.
var microAccl = require('./BLEaccl.js');
var microUART = require('./BLEuart.js');

function getUart(stop) {
    //const accl = microAccl.getAccl();
    var uart = microUART.getUart();
    var prev ="";
    //Constantly check for new messages.
    var time = setInterval(function () {
        
        //const xyz = microAccl.xyz;
        var msg = microUART.msg;
        var lock = 0;
        
        //console.log(xyz);
        if (msg === undefined) {
            //do nothing
        }
        else if (msg.length > 0) {
            console.log("Msg is", msg);
            
            if (prev != msg) {
                //New message detected.
                io.emit('uartMSg', msg);
                prev = msg;
            };
        };
        
        
        
        //Check argument for if the loop should stop.
            if (stop == 1) {
                clearInterval(time);
            };
            
        
    }, 2000);
};
    //getUart();
app.get('/', function (req, res) {
    res.sendFile('D:\\programs\\uni\\IOT\\Challenge3\\index.html');
});

io.on('connection', function (socket) {
    console.log('Web Client Connected');
    socket.on('getUart', function () {
        console.log("Request for UART");
        getUart(0);
    });
    socket.on('stopUart', function () {
        console.log("stopping  UART");
        getUart(1);
    });
});

http.listen(3000, function () {
    console.log('Sever running on port:3000');
});