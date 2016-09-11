#!/usr/bin/env node

//Get the packages we need
var b = require('bonescript');

//We need command line UI, so set that up
var rls = require('readline-sync');

//Get the desired width and height from the user
var width = parseInt(rls.question('Width of grid: '));
var height = parseInt(rls.question('Height of grid: '));

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

//Debounce with 15 ms
var debounceDelay = 15;

//Keep track of the detached buttons when we quit
var detachCount = 0;


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
	if(x.attached) return;
	if(!upBool) return;
	upBool = 0;
    console.log('up');
    if(curY !== 0) {
        curY--;
        display[curY][curX] = "#";
        printDisplay(display);
    }
    setTimeout(debounceUp, debounceDelay);
}

//Handles a down input
function goDown(x){
	if(x.attached) return;
	if(!downBool) return;
	downBool = 0;
    console.log("down");
    if(curY !== height- 1) {
        curY++;
        display[curY][curX] = "#";
        printDisplay(display);
    }
    setTimeout(debounceDown, debounceDelay);
}

//Handles a left input
function goLeft(x){
	if(x.attached) return;
	if(!leftBool) return;
	leftBool = 0;
    console.log('left');
    if(curX !== 0) {
        display[curY][curX] = "#";
        printDisplay(display);
    }
    setTimeout(debounceLeft, debounceDelay);
}

//Handles a right input
function goRight(x){
	if(x.attached) return;
	if(!rightBool) return;
	rightBool = 0;
    console.log('right');
    if(curX !== width - 1) {
        curX++;
        display[curY][curX] = "#";
        printDisplay(display);
    }
    setTimeout(debounceRight, debounceDelay);
}


//The following 4 functions are for debouncing the buttons, use as callbacks
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
	while(detachCount < 5);
	console.log('FInished cleaning up');
	exit();
}

//Count how many pins we detached
function detachCounter(x){
	detachCount++;
	console.log(x.err);
}




