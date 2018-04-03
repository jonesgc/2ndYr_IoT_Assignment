//BLE uart script for IoT Challenge 3
//Authors: Gregory Jones + Sean Kearney
//Code adapted from Noble examples see: https://github.com/noble/noble/blob/master/examples/advertisement-discovery.js
var noble = require('noble');
var util = require('utility');

console.log("Searching for microbit.");
var regex = new RegExp('/^microbit\(([a-z]*)\)/');

var xyz = [];
function getUart() {
    //State of local bluetooth device changed.
    noble.on('stateChange', function (state) {
        if (state === 'poweredOn') {
            noble.startScanning();
        }
        else {
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
        if (peripheral.advertisement.localName == "BBC micro:bit [gipev]") {
            console.log("Found a microbit!");
            peripheral.connect(function (error) {
                console.log("Connected to microbit!");
                //List of services taken from BLE spec.
                uartUUID = "6e400001b5a3f393e0a9e50e24dcca9e";
                uartTXUUID = "6e400002b5a3f393e0a9e50e24dcca9e";
                //Get services, UUIDs for microbit services taken from lancaster uni BLE spec.
                peripheral.discoverServices([], function (error, services) {
                    console.log("Trying to get services");

                    //console.log(services);
                    //Iterate through list of services, this could be changed to for each.
                    for (var i = 0, len = services.length; i < len; i++) {
                        //console.log(services[i].uuid);
                        if (services[i].uuid == uartUUID) {
                            console.log("Found uart");
                            var uartServ = services[i];
                            //Get characteristics for this service.
                            uartServ.discoverCharacteristics([], function (error, chars) {

                                chars.forEach(function (chars) {
                                    //console.log('Char uuid:', chars.uuid);
                                    if (chars.uuid == uartTXUUID) {
                                        
                                        var uartTXChar = chars;
                                        console.log("Got the tx char");
                                        uartTXChar.notify(true, function (error) { console.log("notficaitions on"); });
                                        uartTXChar.on('data', function (data, isNotification) { console.log(data); });
                                        //console.log(uartTXChar);
                                        //TX characteristic requires subscription, data is returned in byte arrays.
                                        uartTXChar.subscribe(function (error) {
                                            console.log("Subscribed");
                                        });
                                       
                                        //uartTXChar.read(function (error, data) { console.log("reading" , data); });
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
getUart();
//module.exports.getAccl = getAccl;
//module.exports.xyz = xyz;
