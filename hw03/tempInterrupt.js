#!/usr/bin/env node
//Get the packages we need
var b = require('bonescript');
var i2c = require('i2c');

//setup the i2c device for the tmp101.
var bus = '/dev/i2c-2';
//addresses
var tmpAddr0 = 0x49;
var tmpAddr1 = 0x48;
var configRegisterValue = 0x00;
//pointers to config registers
var tPointer = 0x00; 
var tLpointer = 0x02;
var tHpointer = 0x03;
var confPointer = 0x01;
//alert pins
var alert0 = 'P9_26';
var alert1 = 'P9_27';
//Alert thresholds
var thresholdL = 26;
var thresholdH = 28;

//Make the sensor object
var sensor0 = new i2c(tmpAddr0, {
    device: bus
});

var sensor1 = new i2c(tmpAddr1, {
    device: bus
});


//Initializes the temperature sensor configuration registers
function initTemp(){
	sensor0.writeBytes(confPointer, [configRegisterValue], function(err) {           
	    sensor0.writeBytes(tLpointer, [thresholdL], function(err) {        
	        sensor0.writeBytes(tHpointer, [thresholdH], function(err) {    
	        	sensor1.writeBytes(confPointer, [configRegisterValue], function(err) {           
	    			sensor1.writeBytes(tLpointer, [thresholdL], function(err) {       
	        			sensor1.writeBytes(tHpointer, [thresholdH], function(err) { 
	        				setTimeout(main, 1000);
	        			});
	    			});
				});
	        });
	    });
	});
}

initTemp();

function main(){
	//Set alert pins
	b.pinMode(alert0, b.INPUT, 7, 'pullup', 'fast', attT0);
	b.pinMode(alert1, b.INPUT, 7, 'pullup', 'fast', attT1);
}


//The following two functions attach the temp sense handler to the two alert pins
function attT0(x){
	b.attachInterrupt(alert0, true, b.FALLING, tHandler);	
}

function attT1(x){
	b.attachInterrupt(alert1, true, b.FALLING, tHandler);
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
