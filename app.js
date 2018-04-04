//Using express for routing.
const express = require('express');
const app = express();


//Bluetooth module.
const noble = require('noble');

const microAccl = require('./BLEaccl.js');
const microUART = require('./BLEuart.js');

//Respond too app index page data.
app.get('/', (req, res) => {
    res.sendFile('D:\\programs\\uni\\IOT\\Challenge3\\index.html');
});

const accl = microAccl.getAccl();
const uart = microUART.getUart();
const time = setInterval(function () {
   
    const xyz = microAccl.xyz;
    const msg = microUART.msg; 
    console.log(xyz);
    console.log(msg);
}, 2000)
    


    //Serve the static public folder so it can be used.
    app.use(express.static('public'));
    //Start Server.
    app.listen(3000, () => console.log('Sever running on port 3000'));


