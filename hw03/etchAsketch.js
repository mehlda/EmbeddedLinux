#!/usr/bin/env node

//This file runs a simple terminal etch-a-sketch progrom on the Beaglebone Black
//Author: David Mehl

//Get the packages we need
var b = require('bonescript');
var i2c = require('i2c');

//setup the i2c device for matrix
var address = 0x70;

var matrix = new i2c(address, {
    device: '/dev/i2c-2'
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

//Debounce with 15 ms
var debounceDelay = 15;

//Keep track of the detached buttons when we quit
var detachCount = 0;


//Keep track of where we are
var curX = 0;
var curY = 0;

//Make the display array
var display = new Array(width * 2);

//Initialize the display array
for(var i = 0; i < display.length; i++){
	display[i] = 0xAA;
}

function initDisplay(){
	matrix.writeByte(0x21, function(err) {            // Start oscillator (p10)
	    matrix.writeByte(0x81, function(err) {        // Disp on, blink off (p11)
	        matrix.writeByte(0xe7, function(err) {    // Full brightness (page 15)
	        	setTimeout(main, 1000);
	        });
	    });
	});
    printDisplay(display);	
}

function printDisplay(display){
		matrix.writeBytes(0x00, display,function(err){
			console.log(err);
		});

}


//Set the button pins to inputs with pulldown resistors and call init functions
b.pinMode(upButton, b.INPUT, 7, 'pulldown', 'fast', attU);
b.pinMode(downButton, b.INPUT, 7, 'pulldown', 'fast', attD);
b.pinMode(leftButton, b.INPUT, 7, 'pulldown', 'fast', attL);
b.pinMode(rightButton, b.INPUT, 7, 'pulldown', 'fast', attR);
b.pinMode(quitButton, b.INPUT, 7, 'pulldown', 'fast', attQ);

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
        display[curX * 2] |= 1<<curY;
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
        display[curX * 2] = 1<<curY;
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
        display[curX * 2] = 1<<curY;
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
        display[curX * 2] = 1<<curY;
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
	//When all 5 are detached, exit the process
	while(detachCount < 5);
	console.log('FInished cleaning up');
	process.exit();
}

//Count how many pins we detached
function detachCounter(x){
	detachCount++;
	if(x.err) console.log(x.err);
}

initDisplay();
function main(){
	console.log("ready");
}

