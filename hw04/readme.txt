boneServer.js
--------------------------------------------------------------------------------
Run this file to instantiate a web server from the bone on port 9090. I have
modified the code in matrixLED.html, matrixLED.css, and matrixLED.js in order
to allow for the control of both LEDs in the 8x8 bicolor LED matrix. As you
click on the buttons of the matrix in the browser, the transition of colors
will be: OFF - > GREEN - > ORANGE(BOTH) - > RED

Wiring Instructions:
Wire the LED matrix to the i2c bus numbered 2 as in the use of i2cdetect.
This means: D on the matrix to P9_20, C on the matrix to P9_19, and + and -
to 3.3V and ground, respectively. You may also require the addition of
4.7K pull-up resistors on the D and C lines.
================================================================================

gpioMmap.c
--------------------------------------------------------------------------------
Run the included Makefile to compile this program. Use 'make clean' to remove
old versions if necessary. This program will read two inputs from the user
and manipulate the USR LEDs accordingly. The input on P9_15 will cause the
USR3 LED to turn on and off, and the input on P9_13 will cause USR2 LED to
turn on and off. This program using memory mapped IO to accomplish this
manipulation.

Wiring Instructions:
Wire a button to P9_13 along with a pulldown resistor on one pole and a
connection to 3.3V on the other pole. Wire another button in the same
fashion to P9_15.
================================================================================

answersToQuestions.txt
--------------------------------------------------------------------------------
This file contains my answers to questions 1-4
================================================================================

I did not edit gpioThru.c as it already accomplished the designated goals
from the homework description. I simply created gpioMmap.c to accomplish
the goal of using two mmap calls
