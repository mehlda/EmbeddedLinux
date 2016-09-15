temperature.sh
-------------------------------------------------------------------------------------------
The bash script temperature.sh is a simple script that gets the temperature from a tmp101
chip using i2c and prints the fahrenheit value to the terminal
===========================================================================================

etchAsketch.js
-------------------------------------------------------------------------------------------
The javascript file etchAsketch.js is a simple implementation of the etch-a-sketch program.
It prints LEDs to the LED matrix after each movement. Movement is triggered by button
presses on the beaglebone.  Simply run the included install.sh file to install the needed
npm packages and run the program. Use the quit button on a breadboard or Ctrl-C to quit
the program. Wire buttons for up, down, left, and right movement, as well as quit, and
the LED matrix for the display, instructions below.

Etch-a-Sketch Wiring instructions:
Place 5 normally-open buttons on a breadboard. Wire one side of each button to 3.3 V. Wire
the other side of the buttons to pins P9_12, P9_14, P9_16, P9_18, and P9_22 to serve as
up, down, left, right, and quit buttons, respectively. Place the LED matrix on the breadboard
and connect SCL to P9_19, SDA to P9_20, and connect power and ground properly.
===========================================================================================
