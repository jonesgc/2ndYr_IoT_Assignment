//BLE uart script for IoT Challenge 3
//Authors: Gregory Jones + Sean Kearney

var noble = require('noble');
var util = require('utility');
//var main = require('./index.js');

//Regex that validates any bbc microbit.
var regex = new RegExp('BBC micro:bit \[[A-z]*\]');
//Find all microbits.
function findMicroBits(){
  //Detect a change in local device, scan if its on.
  //There are multple states which the device can be in e.g resetting.
  console.log("Searching for microbits.");
  noble.on('stateChange', function (state) {
      if (state === 'poweredOn') {
          console.log("Searching for microbit.");
          noble.startScanning();
      }
      else {
          noble.stopScanning();
      };
  });
  var microBits =  [];

  noble.on('discover', function (peripheral) {
    var localName = peripheral.advertisement.localName;
    //console.log(localName);
    var test = regex.test(localName);
    if(test){
      microBits.push(peripheral);
      console.log("Found: " ,localName);
    };
  });
};
