#!/usr/bin/env node

//This file runs a simple LED matrix etch-a-sketch progrom on the Beaglebone Black
//When the sensor with the floating ADD0 pin triggers an interrupt, the display will erase
//When the sensor with grounded ADD0 triggers interrupt, the pointer will swap colors
//Author: David Mehl
// Thanks to Ricky Rung for matrix init function

//Get the packages we need
var b = require('bonescript');
var i2c = require('i2c');


//setup the i2c device for matrix
var bus = '/dev/i2c-2';
var matrixAddress = 0x70;
var startColumn = 0x00;

var matrix = new i2c(matrixAddress, {
    device: bus
});

//setup the i2c device for the tmp101.
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

//Make the sensor objects
var sensor0 = new i2c(tmpAddr0, {
    device: bus
});

var sensor1 = new i2c(tmpAddr1, {
    device: bus
});

//Declare the buttons
var upButton = 'P9_12';
var downButton = 'P9_14';
var leftButton = 'P9_16';
var rightButton = 'P9_18';
var quitButton = 'P9_22';

//Declare debounce booleans
var upBool = 1;
var downBool = 1;
var rightBool = 1;
var leftBool = 1;

//declare size of LED matrix
var width = 8;
var height = 8;

//Debounce with 25 ms
var debounceDelay = 25;

//Keep track of the detached buttons when we quit
var detachCount = 0;


//Keep track of where we are
var curX = 0;
var curY = 0;

//Keep track of color
var colorOffset = 0;

//Make the display array
var display = new Array(width * 2);

//Initialize the display array
function clearDisplay(){
	for(var i = 0; i < display.length; i++){
		display[i] = 0x00;
	}
}

clearDisplay();
//Sets up the i2c LED matrix. Written by Ricky Rung, modified for this program by me
function initDisplay(){
	matrix.writeByte(0x21, function(err) {            // Start oscillator (p10)
	    matrix.writeByte(0x81, function(err) {        // Disp on, blink off (p11)
	        matrix.writeByte(0xe7, function(err) {    // Full brightness (page 15)
	        	printDisplay(display);
	        });
	    });
	});	
}

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

//Prints the display to the LED matrix
function printDisplay(display){
	matrix.writeBytes(startColumn, display,function(err){
		if(err) console.log(err);
	});
}

//Checks the temperature and if it is high enough it clears the display
function checkTemperature(){
	sensor0.writeByte(tPointer, function(err){
	    sensor0.readByte(function(err, result) {
	        if(err) console.log(err);
	        if(result > threshold){
	        	clearDisplay();
	        	printDisplay(display);
	        }
	    });
	});
}


//Set the button pins to inputs with pulldown resistors and call init functions
b.pinMode(upButton, b.INPUT, 7, 'pulldown', 'fast', attU);
b.pinMode(downButton, b.INPUT, 7, 'pulldown', 'fast', attD);
b.pinMode(leftButton, b.INPUT, 7, 'pulldown', 'fast', attL);
b.pinMode(rightButton, b.INPUT, 7, 'pulldown', 'fast', attR);
b.pinMode(quitButton, b.INPUT, 7, 'pulldown', 'fast', attQ);

//Set alert pins
b.pinMode(alert0, b.INPUT, 7, 'pullup', 'fast', attT0);
b.pinMode(alert1, b.INPUT, 7, 'pullup', 'fast', attT1);


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

function attQ(x){
	b.attachInterrupt(quitButton, true, b.RISING, quit);
}

//The following two functions attach the temp sense handler to the two alert pins
function attT0(x){
	b.attachInterrupt(alert0, true, b.FALLING, tHandler);	
}

function attT1(x){
	b.attachInterrupt(alert1, true, b.FALLING, tHandler);
}


//Handles an up input
function goUp(x){
	//ignore if we just attached the interrupt
	if(x.attached) return;
	//Debounce the button
	if(!upBool) return;
	upBool = 0;
    console.log('Up');
    if(curY !== 0) {
        curY--;
        display[curX * 2 + colorOffset] |= 1<<(height - 1 - curY);
        printDisplay(display);
    }
    setTimeout(debounceUp, debounceDelay);
}

//Handles a down input
function goDown(x){
	//ignore if we just attached the interrupt
	if(x.attached) return;
	//Debounce the button
	if(!downBool) return;
	downBool = 0;
    console.log("Down");
    if(curY !== height- 1) {
        curY++;
        display[curX * 2+ colorOffset] |= 1<<(height - 1 - curY);
        printDisplay(display);
    }
    setTimeout(debounceDown, debounceDelay);
}

//Handles a left input
function goLeft(x){
	//ignore if we just attached the interrupt
	if(x.attached) return;
	//Debounce the button
	if(!leftBool) return;
	leftBool = 0;
    console.log('Left');
    if(curX !== 0) {
    	curX--;
        display[curX * 2+ colorOffset] |= 1<<(height - 1 - curY);
        printDisplay(display);
    }
    setTimeout(debounceLeft, debounceDelay);
}

//Handles a right input
function goRight(x){
	//ignore if we just attached the interrupt
	if(x.attached) return;
	//Debounce the button
	if(!rightBool) return;
	rightBool = 0;
    console.log('Right');
    if(curX !== width - 1) {
        curX++;
        display[curX * 2+ colorOffset] |= 1<<(height - 1 - curY);
        printDisplay(display);
    }
    setTimeout(debounceRight, debounceDelay);
}


//The following 4 functions are for debouncing the buttons, used as callbacks
function debounceUp(){
	upBool = 1;
}

function debounceDown(){
	downBool = 1;
}

function debounceLeft(){
	leftBool = 1;
}

function debounceRight(){
	rightBool = 1;
}

//Release the interrupts on the pins and quit
function quit(x){
	if(x.attached) return;
	console.log('Cleaning up...');
	b.detachInterrupt(upButton, detachCounter);
	b.detachInterrupt(downButton, detachCounter);
	b.detachInterrupt(leftButton, detachCounter);
	b.detachInterrupt(rightButton, detachCounter);
	b.detachInterrupt(quitButton, detachCounter);
	b.detachInterrupt(alert0, detachCounter);
	b.detachInterrupt(alert1, detachCounter);
	//When all 7 are detached, exit the process
	while(detachCount < 7);
	console.log('Finished cleaning up');
	process.exit();
}

//Handles the temperature alerts
function tHandler(x){
	if(x.attached) return;
	if(x.pin.key === alert0){
		console.log("Erase!");
		clearDisplay();
		printDisplay(display);
	} else {
		if(colorOffset === 1){
			console.log("Green!");
			colorOffset = 0;
		} else {
			console.log("Red!");
			colorOffset = 1;
		}
	}
}

//Count how many pins we detached
function detachCounter(x){
	detachCount++;
	if(x.err) console.log(x.err);
}

initDisplay();
initTemp();
//Show that code is ready
function main(){
	console.log("Ready!");
}

