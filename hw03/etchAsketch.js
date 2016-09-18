#!/usr/bin/env node

//This file runs a simple LED matrix etch-a-sketch progrom on the Beaglebone Black
//Author: David Mehl
// Thanks to Ricky Rung for matix init function

//Get the packages we need
var b = require('bonescript');
var i2c = require('i2c-bus');
var bus = i2c.openSync(2);

//setup the i2c bus
//matrix constants
//declare size of LED matrix
var width = 8;
var height = 8;
var matrixAddress = 0x70;
var colorOffset = 0;

//Make the display array
var display = new Array(width * 2);

//tmp101 constants
var tmpAddr0 = 0x49;
var tmpAddr1 = 0x48;
var tPointer = 0x00; //pointer to temperature register in tmp101
var tLpointer = 0x02;
var tHpointer = 0x03;
var configPointer = 0x01;
var alert0 = 'P9_26';
var alert1 = 'P9_27';

//declare the temperature erase thresholds, in degrees C
var thresholdH = 28;
var thresholdL = 26;


//Declare hardware constants
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

//Debounce with 25 ms
var debounceDelay = 25;

//Keep track of the detached buttons when we quit
var detachCount = 0;


//Keep track of where we are
var curX = 0;
var curY = 0;

//Prints the display to the LED matrix
function printDisplay(){
	bus.i2cWriteSync(matrixAddress, display.length, display);
}

//CLear and print display
function clearDisplay(){
	for(var i = 0; i < display.length; i++){
		display[i] = 0x00;
	}
	printDisplay();
}

//Sets up the i2c LED matrix. Thanks to Ricky Rung for finding config values
function initDisplay(){
	bus.i2cWriteSync(matrixAddress, 1, 0x21);
	bus.i2cWriteSync(matrixAddress, 1, 0x81);
	bus.i2cWriteSync(matrixAddress, 1, 0xE7);
    clearDisplay();	
}

//Sets the pointer register in a tmp101 device with the supplied address
function setPointerRegister(addr, reg){
	bus.i2cWriteSync(addr, 1, reg);
}

//Initialized tmp101 sensor
function initTmp(addr){
	bus.i2cWriteSync(addr, 2, [configPointer, 0x00]);
	bus.i2cWriteSync(addr, 2, [tLpointer, thresholdL]);
	bus.i2cWriteSync(addr, 2, [tHpointer, thresholdH]);
}

//Checks the temperature and if it is high enough it clears the display
function checkTemperature(){
	setPointerRegister(tmpAddr0, tPointer);
	var temp = new Array(2);
	bus.i2cReadSync(tmpAddr0, 2, temp);
	console.log("Temperature for sensor at %i",tmpAddr0);
	console.log(temp[0] <<8 | temp[1]);
	setPointerRegister(tmpAddr1, tPointer);
	bus.i2cReadSync(tmpAddr1, 2, temp);
	console.log("Temperature for sensor at %i",tmpAddr1);
	console.log(temp[0] <<8 | temp[1]);
}


//Set the button pins to inputs with pulldown resistors and call init functions
b.pinMode(upButton, b.INPUT, 7, 'pulldown', 'fast', attU);
b.pinMode(downButton, b.INPUT, 7, 'pulldown', 'fast', attD);
b.pinMode(leftButton, b.INPUT, 7, 'pulldown', 'fast', attL);
b.pinMode(rightButton, b.INPUT, 7, 'pulldown', 'fast', attR);
b.pinMode(quitButton, b.INPUT, 7, 'pulldown', 'fast', attQ);

//set alert pins to inputs with pullups
// b.pinMode(alert0, b.INPUT, 7, 'pullup', 'fast', attT0);
// b.pinMode(alert1, b.INPUT, 7, 'pullup', 'fast', attT1);

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

//Attach interrupts to alert pins
function attT0(x){
	console.log("Attach0");
	b.attachInterrupt(alert0, true, b.FALLING, tempHandler);
}
function attT1(x){
	console.log("Attach1");
	b.attachInterrupt(alert1, true, b.FALLING, tempHandler);
}


//Handles an up input
function goUp(x){
	//ignore if we just attached the interrupt
	if(x.attached) return;
	//Debounce the button
	if(!upBool) return;
	upBool = 0;
    console.log('up');
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
    console.log("down");
    if(curY !== height- 1) {
        curY++;
        display[curX * 2 + colorOffset] |= 1<<(height - 1 - curY);
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
    console.log('left');
    if(curX !== 0) {
    	curX--;
        display[curX * 2 + colorOffset] |= 1<<(height - 1 - curY);
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
    console.log('right');
    if(curX !== width - 1) {
        curX++;
        display[curX * 2 + colorOffset] |= 1<<(height - 1 - curY);
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

//Count how many pins we detached
function detachCounter(x){
	detachCount++;
	if(x.err) console.log(x.err);
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
	//When all 5 are detached, exit the process
	while(detachCount < 7);
	console.log('Finished cleaning up');
	process.exit();
}

//If alert is from tmp0 then erase, otherwise swap colors
function tempHandler(x){
	console.log("TempHandler");
	if(x.attached) return;
	if(x.pin.key === alert0){
		//erase
		clearDisplay();
	}
	if(x.pin.key === alert1){
		//change color
		if(colorOffset === 0) {
			colorOffset = 1;
		} else {
			colorOffset = 0;
		}
	}
}

console.log("InitDisplay");
initDisplay();
// console.log("InitTMP");
// initTmp(tmpAddr0);
// initTmp(tmpAddr1);
// console.log("InitcheckTemp");
// setInterval(checkTemperature, 1000);
function main(){
	console.log("ready");
}

main();
