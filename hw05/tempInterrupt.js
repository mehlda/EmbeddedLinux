#!/usr/bin/env node
//Get the packages we need
var b = require('bonescript');
var i2c = require('i2c');
var fs = require('fs');
var util = require('util');
var request = require('request');

//setup the i2c device for the tmp101.
var bus = '/dev/i2c-2';
//addresses
var tmpAddr0 = 0x49;
var tmpAddr1 = 0x48;

// Delay between data uploads
var delay = 1000;


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

//Set up communication variables
var keyFile = "/root/EmbeddedLinux/hw05/keys_tmp101.json";
var keys = JSON.parse(fs.readFileSync(keyFile));
var urlBase = keys.inputUrl + "/?private_key=" + keys.privateKey + "&temp0=%s&temp1%s";
console.log(keys);
console.log(urlBase);


//Handles the temperature sending
function tHandler(){
	var temp = [0,0];
	sensor0.readBytes(0x00, 2, function(err, res){
		console.log("Sensor 0 temperature:");
		console.log(((res[0]<<8) | res[1]) / 256 * 9 / 5 + 32);
		temp[0] = res;
		sensor1.readBytes(0x00, 2, function(err, res){
			console.log("Sensor 1 temperature:");
			console.log(((res[0]<<8) | res[1]) / 256 * 9 / 5 + 32);
			temp[1] = res;
			var url = util.format(urlBase, temp[0], temp[1]);
			request(url, function (error, response, body){
				if(!error && response.statusCode === 200){
					console.log(body)
				} else {
					console.log(error);
				}
			});

		});
	});
}

main();

/*

Public URL

http://data.sparkfun.com/streams/NJOV7pXQzyfZd4N7wdrN

Public Key

NJOV7pXQzyfZd4N7wdrN

Private Key

5dZvwW5XzyHKJlPrqJNP

Keep this key secret, and in a safe place.  You will not be able to retrieve it.
Delete Key

BpbAdYGj4WuZarA9xa5A

This key can only be used once.  Keep this key secret, and in a safe place.  You will not be able to retrieve it.
*/