//Using express for routing.
const express = require('express');
const app = express();


//Bluetooth module.
const noble = require('noble');

const microAccl = require('./BLEaccl.js');

//Respond too app index page data.
app.get('/', (req, res) => {
    res.sendFile('D:\\programs\\uni\\IOT\\Challenge3\\index.html');
});
const test = microAccl.getAccl();
const xyz = microAccl.xyz;
console.log(xyz);
//Serve the static public folder so it can be used.
app.use(express.static('public'));
//Start Server.
app.listen(3000, () => console.log('Sever running on port 3000'));


