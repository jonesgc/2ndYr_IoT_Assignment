//Code adapted from Noble examples see: https://github.com/noble/noble/blob/master/examples/advertisement-discovery.js
var noble = require('noble');

console.log("Searching for microbit.");
var regex = new RegExp('/^microbit\(([a-z]*)\)/');

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
        if (peripheral.advertisement.localName == "BBC micro:bit [gipev]")
        {
            console.log("Found a microbit!");
            peripheral.connect(function (error) {
                console.log("Connected to microbit!");

                //Get services, UUIDs for microbit services taken from lancaster uni BLE spec.
                peripheral.discoverServices([], function (error, services) {
                    console.log("Trying to get services");
                    var accl = "E95D0753251D470AA062FA1922DFA9A8";
                    //console.log(services);
                    for (var i = 0, len = services.length; i < len; i++)
                    {
                        //Service UUIDs are lowercase, but UUIDs in specification are uppercase. 
                        var serviceUUID = services[i].uuid;
                        var temp = serviceUUID.toUpperCase();
                        console.log(services[i].uuid);
                        //Find the services we want.
                        if(temp == accl)
                        {
                            console.log("Found the acclerometer.");
                        }
                    }
                });
            });
        }
        console.log();
    });

