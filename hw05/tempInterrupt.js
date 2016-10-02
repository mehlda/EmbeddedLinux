#!/usr/bin/env node
//Get the packages we need
var b = require('bonescript');
var i2c = require('i2c');

//setup the i2c device for the tmp101.
var bus = '/dev/i2c-2';
//addresses
var tmpAddr0 = 0x49;
var tmpAddr1 = 0x48;


//Make the sensor object
var sensor0 = new i2c(tmpAddr0, {
    device: bus
});

var sensor1 = new i2c(tmpAddr1, {
    device: bus
});

function main(){
	setInterval(tHandler, delay);
}


//Handles the temperature alerts
function tHandler(x){
	if(x.attached) return;
	if(x.pin.key === alert0){
		sensor0.readBytes(0x00, 2, function(err, res){
			console.log("Sensor 0 temperature:");
			console.log(((res[0]<<8) | res[1]) / 256 * 9 / 5 + 32);
		});
	} else {
		sensor1.readBytes(0x00, 2, function(err, res){
			console.log("Sensor 1 temperature:");
			console.log(((res[0]<<8) | res[1]) / 256 * 9 / 5 + 32);
		});
	}
}
