buttonLED.js
-------------------------------------------------------------------------------------------
The javascript file buttonLED.js is a simple program that turns 4 LEDs on and off based on 
the state of 4 buttons. When run, pressing a button will turn on its corresponding LED.
Releasing that button will turn off the LED. Run the buttonLED.sh script to make the file
executable and run it. Wire the breadboard as described below.

ButtonLED Wiring Instructions:
Place 4 normally-open buttons on a breadboard. Wire one side of each button to 3.3 V. Wire
the other side of the buttons to pins P9_12, P9_14, P9_16, and P9_18 to serve as control
buttons. Then connect pins P9_13, P9_15, P9_17, and P9_21 to the positive side of 4 LEDs.
The first through fourth buttons will control the first through fourth LEDs as in the order
they are listed above. Connect the negative side of the LED to a 820 ohm resistor with the
other end connected to ground.
==========================================================================================

etchAsketch.js
-------------------------------------------------------------------------------------------
The javascript file etchAsketch.js is a simple implementation of the etch-a-sketch program.
It prints a new grid to the terminal after each movement. Movement is triggered by button
presses on the beaglebone.  Simply run the included install.sh file to install the needed
npm packages and run the program. Use the quit button on a breadboard or Ctrl-C to quit
the program. Wire buttons for up, down, left, and right movement, instructions below.

Etch-a-Sketch Wiring instructions:
Place 5 normally-open buttons on a breadboard. Wire one side of each button to 3.3 V. Wire
the other side of the buttons to pins P9_12, P9_14, P9_16, P9_18, and P9_22 to serve as
up, down, left, right, and quit buttons, respectively.
===========================================================================================