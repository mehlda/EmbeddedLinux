#!/usr/bin/env node
/* gpioNode.js
 * node.js implementation of pin following
 * Author: David Mehl
 *
*/ 

var b = require('bonescript');

// Define the pins
var leader = 'P9_24';
var follower = 'P9_27';

function init(){
	b.pinMode(leader, b.INPUT, 7, 'pulldown', 'fast', attToggle);
	b.pinMode(follower, b.OUTPUT, 7);
}

function attToggle(){
	b.attachInterrupt(leader, true, b.CHANGE, toggle);
}

function toggle(){
	if(b.digitalRead(leader)){
		b.digitalWrite(follower, b.HIGH);
	} else {
		b.digitalWrite(follower, b.LOW);
	}
}

init();
