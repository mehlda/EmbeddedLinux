#!/usr/bin/env node

//Buttons and LEDs with interrupts
//Author: David Mehl
//Press the button to turn on the corresonding LED. Release the button to turn it off

//Get the bonescript package
var b = require('bonescript');

//Create LED array
var leds = ['P9_13', 'P9_15', 'P9_17', 'P9_21'];

//Create button array
var buttons = ['P9_12', 'P9_14', 'P9_16', 'P9_18'];

// Debounce buttons with 1 ms debounce delay; bouncing shouldn't be an issue with this method of LED manipulation, but in case it is desired later I have included it
//All four buttons share the same debounce setup, but this should be fast enough
var debounceBool = 1;
var debounceDelay = 1;

//Initialize LEDs as outputs
for(var i = 0; i < leds.length; i++){
    b.pinMode(leds[i], b.OUTPUT);
}

//Initialize buttons as inputs with pulldown resistors
//Attach interrupt to the buttons on change
for(var j = 0; j < buttons.length; j++){
    b.pinMode(buttons[j], b.INPUT, 7, 'pulldown', 'fast');
    b.attachInterrupt(buttons[j], true, b.CHANGE, toggleLED);
}

//Sets the LED based on the button state, essentially a button press, on then off, will toggle the LED
function toggleLED(x){
    //Ignore if attached
    if(x.attached) return;
    if(!debounceBool) return;
    debounceBool = 0;
    for(var k = 0; k < buttons.length; k++){
        if(buttons[k] === x.pin.key){
            b.digitalWrite(leds[k], x.value);
        }
    }
    //Debounce reset function
    setTimeout(resetDebounce, debounceDelay);
}

//Resets the debounce boolean
function resetDebounce(x){
    debounceBool = 1;
}