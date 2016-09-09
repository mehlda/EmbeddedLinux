#!/usr/bin/env node

//Get the packages we need
var b = require('bonescript');
var s = require('sleep');

//We need UI, so set that up
var rls = require('readline-sync');

//Get the desired width and height from the user
var width = parseInt(rls.question('Width of grid: '));
var height = parseInt(rls.question('Height of grid: '));

//Declare the buttons
var upButton = 'P9_12';
var downButton = 'P9_14';
var leftButton = 'P9_16';
var rightButton = 'P9_18';

//Debounce with 15 ms
var debounceDelay = 15000;


//Keep track of where we are
var curX = 0;
var curY = 0;

//Make the display array
var display = new Array(height);

//Initialize the display array
for(var i = 0; i < display.length; i++){
	display[i] = new Array(width);
	for(var j = 0; j < display[i].length; j++){
		display[i][j] = ' ';
	}
}

//Prints the given array to the terminal
function printDisplay(disp){
    process.stdout.write('Use Control-C to quit\n');
	for(var k = 0; k < disp[0].length; k++){
		process.stdout.write('*');
	}
	process.stdout.write('\n');
	for(var i = 0; i < disp.length; i++){
		for(var j = 0; j < disp[0].length; j++){
			process.stdout.write(disp[i][j]);
		}
		process.stdout.write('\n');
	}
	for(var p = 0; p < disp[0].length; p++){
		process.stdout.write('*');
	}
	process.stdout.write('\n');
}
printDisplay(display);




// for(var i in leds) {
//     b.pinMode(leds[i], b.OUTPUT);
// }

// var state = b.LOW;
// for(var i in leds) {
//     b.digitalWrite(leds[i], state);
// }

//Set the button pins to inputs with pulldown resistors and call init functions
b.pinMode(upButton, b.INPUT, 7, 'pulldown', 'fast', attU);
b.pinMode(downButton, b.INPUT, 7, 'pulldown', 'fast', attD);
b.pinMode(leftButton, b.INPUT, 7, 'pulldown', 'fast', attL);
b.pinMode(rightButton, b.INPUT, 7, 'pulldown', 'fast', attR);

//The following four functions handle attaching interrupts to the buttons
function attU(x){
    b.attachInterrupt(upButton, true, b.RISING, goUp);
}

function attD(x){
    b.attachInterrupt(downButton, true, b.RISING, goDown);
}

function attL(x){
    b.attachInterrupt(leftButton, true, b.RISING, goLeft);
}

function attR(x){
    b.attachInterrupt(rightButton, true, b.RISING, goRight);
}


//Handles an up input
function goUp(){
    console.log('up');
    if(curY !== 0) {
        curY--;
        s.usleep(debounceDelay);
        display[curY][curX] = "#";
        printDisplay(display);
    }
}

//Handles a down input
function goDown(){
    console.log("down");
    if(curY !== height- 1) {
        curY++;
        s.usleep(debounceDelay);
        display[curY][curX] = "#";
        printDisplay(display);
    }
}

//Handles a left input
function goLeft(){
    console.log('left');
    if(curX !== 0) {
        curX--; 
        s.usleep(debounceDelay);
        display[curY][curX] = "#";
        printDisplay(display);
    }
}

//Handles a right input
function goRight(){
    console.log('right');
    if(curX !== width - 1) {
        curX++;
        s.usleep(debounceDelay);
        display[curY][curX] = "#";
        printDisplay(display);
    }
   
}




