var noble = require('noble');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//BLE moules.
var microAccl = require('./BLEaccl.js');
var microUART = require('./BLEuart.js');
var stop = 0;
function getUart() {
    
    var uart = microUART.getUart();
    var prev ="";
    //Constantly check for new messages.
    var time = setInterval(function () {
   
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
            console.log("Stopping");
                clearInterval(time);
            };
            
        
    }, 2000);
};
    
function getAccl() {
    var accl = microAccl.getAccl();
    console.log("Getting Accl data");
    var time = setInterval(function () {
        
        var xyz = microAccl.xyz;
        //console.log(xyz);
        io.emit('acclData', xyz);
        
        //Check argument for if the loop should stop.
        if (stop == 1) {
            console.log("Stopping");
            clearInterval(time);
        };
    },2000);
};


app.get('/', function (req, res) {
    res.sendFile('D:\\programs\\uni\\IOT\\Challenge3\\index.html');
});

io.on('connection', function (socket) {
    console.log('Web Client Connected');
    //Request from client for uart msgs.
    socket.on('getUart', function () {
        console.log("Request for UART");
        getUart();
        stop = 0;
    });
    //Stop getting uart messages.
    socket.on('stopUart', function () {
        console.log("stopping  UART");
        stop = 1;
    });
    //Client requests to send a msg to microbit.
    socket.on('sendMsg', function (msgToSend) {
        console.log("Client wants to send: ", msgToSend);
        module.exports.msgToSend = msgToSend;
        var test = microUART.sendMsg();
        console.log("Message sent", test);
    });
    //Request from client for accl data.
    socket.on('getAccl', function () {
        console.log("Request for Accl");
        getAccl();
    });
    //Stop getting acclerometer data.
    socket.on('stopAccl', function () {
        console.log("Stopping Accl");
    });
});

http.listen(3000, function () {
    console.log('Sever running on port:3000');
});