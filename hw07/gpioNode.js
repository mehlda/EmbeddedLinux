#!/usr/bin/env node
/* gpioNode.js
 * node.js implementation of pin following
 * Author: David Mehl
 *
*/ 

// Get the needed package
var b = require('bonescript');

// Define the pins
var leader = 'P9_24';
var follower = 'P9_27';

// Initialize the pins and attach the interrupt
function init(){
	b.pinMode(leader, b.INPUT, 7, 'pulldown', 'fast', attToggle);
	b.pinMode(follower, b.OUTPUT, 7);
}

//Attach the interrupt
function attToggle(){
	b.attachInterrupt(leader, true, b.CHANGE, toggle);
}

//Toggle the output pin based on the input pin
function toggle(){
	if(b.digitalRead(leader)){
		b.digitalWrite(follower, b.HIGH);
	} else {
		b.digitalWrite(follower, b.LOW);
	}
}

//Start
init();

//Remove the interrupt
function detach(){
	b.detachInterrupt(leader);
}

// Remove interrupt after 10 seconds to avoid bogging the CPU
setTimeout(detach, 10000);
