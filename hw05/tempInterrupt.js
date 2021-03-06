#!/usr/bin/env node
// Author: David Mehl
//Get the packages we need
var b = require('bonescript');
var i2c = require('i2c');
var fs = require('fs');
var request = require('request');

//setup the i2c device for the tmp101.
var bus = '/dev/i2c-2';
//addresses
var tmpAddr0 = 0x49;
var tmpAddr1 = 0x48;

// Delay between data uploads
var delay = 1000;


//Make the sensor objects
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
var urlBase = keys.inputUrl + "?private_key=" + keys.privateKey;


//Handles the temperature sending
function tHandler(){
	var url = urlBase;
	sensor0.readBytes(0x00, 1, function(err, res){
		//add the first temperature reading
		url += "&temp0=" + res[0].toString();
		sensor1.readBytes(0x00, 1, function(err, res){
			//add the second temperature reading
			url += "&temp1=" + res[0].toString();
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