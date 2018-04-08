//Code adapted from Noble examples see: https://github.com/noble/noble/blob/master/examples/advertisement-discovery.js
var noble = require('noble');
var util = require('utility');

console.log("Searching for microbit.");
var regex = new RegExp('/^microbit\(([a-z]*)\)/');

var xyz = [];
function getAccl(){
    //State of local bluetooth device changed.
noble.on('stateChange', function (state)
{
    if (state === 'poweredOn')
    {
        noble.startScanning();
    }
    else
    {
        noble.stopScanning();
    }
});


    //A BT device has been found.
    noble.on('discover', function (peripheral) {
        //Display device details.
        console.log('peripheral discovered (' + peripheral.id +
                    ' with address <' + peripheral.address + ', ' + peripheral.addressType + '>,' +
                    ' connectable ' + peripheral.connectable + ',' +
                    ' RSSI ' + peripheral.rssi + ':');
        console.log('\thello my local name is:');
        console.log('\t\t' + peripheral.advertisement.localName);
        console.log('\tcan I interest you in any of the following advertised services:');
        console.log('\t\t' + JSON.stringify(peripheral.advertisement.serviceUuids));

        //Display device service.
        var serviceData = peripheral.advertisement.serviceData;
        if (serviceData && serviceData.length) {
            console.log('\there is my service data:');
            for (var i in serviceData) {
                console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
            }
        }

        //Find and attempt to connect to the bbc microbit.
        if (peripheral.advertisement.localName == "BBC micro:bit [pitig]")
        {
            console.log("Found a microbit!");
            peripheral.connect(function (error) {
                
                console.log("Connected to microbit!");
                //List of services taken from BLE spec.
                //Acclerometer service UUIDs.
                var accl = "e95d0753251d470aa062fa1922dfa9a8";
                //Accelerometer data.
                var acclData = "e95dca4b251d470aa062fa1922dfa9a8";
                //Accelerometer period is how often it is queried for data.
                var acclPer = "e95dfb24251d470aa062fa1922dfa9a8";
                //Get services, UUIDs for microbit services taken from lancaster uni BLE spec.
                peripheral.discoverServices([], function (error, services) {
                    console.log("Trying to get services");
                    
                    //console.log(services);
                    //Iterate through list of services, this could be changed to for each.
                    for(var i=0, len = services.length; i < len; i++)
                    {
                        //console.log(services[i].uuid);
                        if(services[i].uuid == accl)
                        {
                            console.log("Found accl");
                            var acclServ = services[i];
                            //Get characteristics for this service.
                            acclServ.discoverCharacteristics([], function (error, chars) {

                                chars.forEach(function (chars) {
                                    //console.log('Char uuid:', chars.uuid);
                                    if (chars.uuid == acclData)
                                    {
                                        var acclDataChar = chars;
                                        var timer = setInterval(function () {
                                            
                                            //console.log("Got the data char");
                                            acclDataChar.read(function (error, data) {
                                                //console.log("Raw data:", data);
                                                //Raw data from accelerometer.
                                                var rawData = Array.prototype.slice.call(data, 0);
                                                var rawX = new Int16Array();
                                                rawX = rawData.slice(0, 1);
                                                var rawY = new Int16Array();
                                                rawY = rawData.slice(2, 3);
                                                var rawZ = new Int16Array();
                                                rawZ = rawData.slice(4, 5);
                                                //console.log("Raw X val",rawX);
                                                //console.log("Raw y val",rawY);
                                                //console.log("Raw Z val", rawZ);
                                                var datX = rawX / 1000;
                                                var datY = rawY / 1000;
                                                var datZ = rawZ / 1000;
                                               // console.log("X axis:", datX);
                                                //console.log("Y axis:", datY);
                                                //console.log("Z axis:", datZ);
                                                xyz[0] = datX;
                                                xyz[1] = datY;
                                                xyz[2] = datZ;
                                                module.exports.xyz = xyz;
                                            })
                                        }
                                            ,1000);
                                        
                                    }
                                   
                                })
                            });
                        }
                    }
                });
            });
        }
        console.log();
    });
}
//debug
//getAccl();
module.exports.getAccl = getAccl;
