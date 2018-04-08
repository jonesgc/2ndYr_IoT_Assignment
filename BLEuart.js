//BLE uart script for IoT Challenge 3
//Authors: Gregory Jones + Sean Kearney
//Code adapted from Noble examples see: https://github.com/noble/noble/blob/master/examples/advertisement-discovery.js
var noble = require('noble');
var util = require('utility');
var main = require('./index.js');

var regex = new RegExp('/^microbit\(([a-z]*)\)/');
var msg = "";
var com = 0;
function getUart() {
    //State of local bluetooth device changed.
    noble.on('stateChange', function (state) {
        if (state === 'poweredOn') {
            console.log("Searching for microbit.");
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


        //Find and attempt to connect to the bbc microbit.
        if (peripheral.advertisement.localName == "BBC micro:bit [gipev]") {
            console.log("Found a microbit!");
            peripheral.connect(function (error) {
                console.log("Connected to microbit!");
                //List of services taken from BLE spec.
                uartUUID = "6e400001b5a3f393e0a9e50e24dcca9e";
                uartTXUUID = "6e400002b5a3f393e0a9e50e24dcca9e";
                uartRXUUID = "6e400003b5a3f393e0a9e50e24dcca9e";
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
                            var rawMsg = "";
                            //Get characteristics for this service.
                            uartServ.discoverCharacteristics([], function (error, chars) {

                                chars.forEach(function (chars) {
                                    //console.log('Char uuid:', chars.uuid);
                                    if (chars.uuid == uartTXUUID) {

                                        var uartTXChar = chars;
                                        console.log("Got the tx char");
                                        //Enable notifcations / indications.
                                        uartTXChar.notify(true, function (error) {
                                            console.log("notficaitions on");
                                        });
                                        //Total number of packets to expect.
                                        var eom = 0;
                                        var packets = 0;
                                        var count = 0;

                                        //Event listener for indications from serivce.
                                        uartTXChar.on('data', function (data, isNotification) {
                                            var dataChar = data.toString('ascii');
                                            //Decrypt.
                                            function decrypt(char) {
                                                if (char == '|') {
                                                    //Dont "decrypt" eom.
                                                    return '|';
                                                }
                                                else {
                                                    return String.fromCharCode(char.charCodeAt(0) - 2);
                                                };

                                            };

                                            dataChar = decrypt(dataChar);
                                            if (packets == 0) {
                                                packets = data.toString('ascii');
                                                //Dont count the null terminator.
                                                packets--;
                                                console.log("Number of  packets.", packets);
                                                count++;
                                            }
                                            else if(dataChar == 0)
                                            {
                                              //Uart first packet will contain a 0, ignore this.
                                            }
                                            //console.log(data.toString('ascii'));
                                            else if (dataChar == '|') {
                                                console.log("EOM.");
                                                eom = 1;
                                                module.exports.packets = packets;
                                                packets = 0;
                                                en = "";
                                            }
                                            //Append character to msg.
                                            else if(count > 0){
                                                rawMsg = rawMsg + dataChar;
                                                //console.log(msg);
                                                count++;
                                            };
                                        });
                                        //console.log(uartTXChar);
                                        //TX characteristic requires subscription, data is returned in byte arrays.
                                        uartTXChar.subscribe(function (error) {
                                            console.log("Subscribed");
                                        });
                                        var time = setInterval(function () {
                                            //Update the value of msg.


                                            if (eom == 1) {
                                                msg = rawMsg;

                                                module.exports.msg = msg;
                                                eom = 0;
                                                module.exports.eom = eom;
                                                console.log("Clearing buffers");
                                                msg = "";
                                                rawMsg = "";
                                                //clearInterval(time);

                                            };
                                            //console.log("raw is", rawMsg, "msg is", msg);
                                        }, 1000);
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

//Send msg to microbit.
function sendMsg() {
  var eom = 0;

    console.log("Start of sender");
        //State of local bluetooth device changed.
        noble.on('stateChange', function (state) {
            if (state === 'poweredOn') {
                console.log("Searching for microbit.");
                noble.startScanning();
            }
            else {
                noble.stopScanning();
                console.log("Stop scanning");
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

            //Find and attempt to connect to the bbc microbit. Name of microbit is hardcoded consider changing to regex.
            if (peripheral.advertisement.localName == "BBC micro:bit [gipev]") {
                console.log("Found a microbit!");
                peripheral.connect(function (error) {
                    console.log("Connected to microbit!");
                    //List of services taken from BLE spec.
                    uartUUID = "6e400001b5a3f393e0a9e50e24dcca9e";
                    uartTXUUID = "6e400002b5a3f393e0a9e50e24dcca9e";
                    uartRXUUID = "6e400003b5a3f393e0a9e50e24dcca9e";
                    //Get services, UUIDs for microbit services taken from lancaster uni BLE spec.
                    peripheral.discoverServices([], function (error, services) {
                        console.log("Trying to get services");

                        //console.log(services);
                        //Iterate through list of services, this could be changed to for each.
                        for (let i = 0, len = services.length; i < len; i++) {
                            console.log("Searching Services.");
                            //console.log(services[i].uuid);
                            if (services[i].uuid == uartUUID) {
                                console.log("Found uart service");
                                var uartServ = services[i];
                                var rawMsg = "";
                                //Get characteristics for this service.
                                uartServ.discoverCharacteristics([], function (error, chars) {
                                  console.log("Discovering chars");
                                    chars.forEach(function (chars) {
                                      console.log("For each through chars.");
                                      if(eom == 1)
                                      {
                                        console.log("Trying to exit.");
                                        return true;
                                      };
                                        //console.log('Char uuid:', chars.uuid);
                                        if (chars.uuid == uartRXUUID) {
                                            console.log("got the rx char");
                                            var rxChar = chars;
                                            var msgToSend = main.msgToSend;
                                            //Encryptor function, reverse of decrypt.
                                            function encrypt(char) {
                                                if (char == '|') {
                                                    //Dont "decrypt" eom.
                                                    return '|';
                                                }
                                                else {
                                                    return String.fromCharCode(char.charCodeAt(0) + 2);
                                                };
                                            };
                                            //Append eom char.
                                            msgToSend += '|';
                                            //Loop through the msgToSend, breaking it into characters
                                            //this is because of the limit (20 bytes) on uart sending.
                                            console.log("Trying to write", msgToSend);
                                            for (var x = 0; x < msgToSend.length; x++) {
                                                console.log("Sending: ", msgToSend.charAt(x));
                                                //Encrypt the character before sending.

                                                var enChar = encrypt(msgToSend.charAt(x));

                                                console.log("Encrypted char is:", enChar);
                                                var bufToSend = Buffer.from(enChar, 'ascii');
                                                console.log("Trying to send: ", bufToSend);
                                                //Write to rx char without resposnse.
                                                rxChar.write(bufToSend, true);
                                                if (enChar == '|') {
                                                    //Finished sending.
                                                    console.log("End of message.");
                                                    eom = 1;
                                                };

                                            };
                                            console.log("end of chars loop");
                                        }
                                        console.log("end of chars");
                                    })
                                    console.log("end of discover chars ");

                                });
                                console.log("end of servs if");
                            }
                            console.log("end of servs loop");
                        }
                        console.log("end of discover ");
                    });
                    console.log("end of conn ");
                });
                console.log("end of conn match if");
            }
            console.log("end of discover");
        });

};
//debug
//getUart();
//Check for message.
//var time = setInterval(function () { console.log("trying to get msg", msg); }, 1000);
//console.log(test);
module.exports.getUart = getUart;
module.exports.sendMsg = sendMsg;
//module.exports.uartDisconn = disConn;
//var time = setInterval(function () { module.exports.msg = msg; }, 1000);
