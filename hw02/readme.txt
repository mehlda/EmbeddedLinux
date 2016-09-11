The javascript file etchAsketch.js is a simple implementation of the etch-a-sketch program.
It prints a new grid to the terminal after each movement. Movement is triggered by button
presses on the beaglebone.  Simply run the included install.sh file to install the needed
npm packages and run the program. Use the quit button on a breadboard or Ctrl-C to quit
the program. Wire buttons for up, down, left, and right movement, instructions below.

Wiring instructions:
Place 5 normally-open buttons on a breadboard. Wire one side of each button to 3.3 V. Wire
the other side of the buttons to pins P9_12, P9_14, P9_16, P9_18, and P9_22 to serve as
up, down, left, right, and quit buttons, respectively.