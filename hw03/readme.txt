temperature.sh
-------------------------------------------------------------------------------------------
The bash script temperature.sh is a simple script that gets the temperature from a tmp101
chip using i2c and prints the fahrenheit value to the terminal. The script also sets the
three configuration registers, but these do not hold their values. See the wiring 
instructions for Etch-a-Sketch for proper i2c bus on the Bone
===========================================================================================

etchAsketch.js
-------------------------------------------------------------------------------------------
The javascript file etchAsketch.js is a simple implementation of the etch-a-sketch program.
It prints LEDs to the LED matrix after each movement. Movement is triggered by button
presses on the beaglebone.  The display will erase when the TMP101 sensor reaches a certain
threshold temperature, currently set to 28 degrees C. Simply run the included install.sh 
file to install the needed npm packages and run the program. Use the quit button on a 
breadboard or Ctrl-C to quit the program. Wire buttons for up, down, left, and right 
movement, as well as quit, and the LED matrix for the display, and the TMP101 sensor 
for erase, instructions below.

Etch-a-Sketch Wiring instructions:
Place 5 normally-open buttons on a breadboard. Wire one side of each button to 3.3 V. Wire
the other side of the buttons to pins P9_12, P9_14, P9_16, P9_18, and P9_22 to serve as
up, down, left, right, and quit buttons, respectively. Place the LED matrix on the breadboard
and connect SCL to P9_19, SDA to P9_20, and connect power and ground properly. Attach 4.7k
pullup resistors to the SCL and SDA lines. Wire a TMP101 i2c temperature sensor to the same
i2c pins on the bone, and leave the ADD0 pin floating to allow for address 0x49
===========================================================================================

Notes:
I have attempted to get the TMP101 to hold its configuration, but to no avail. For some reason
the registers reset as if the device was powered down and powered up. Therefore I only make use
of the temperature output, at least as of right now until I can figure this issue out. I would
have used a pin change interrupt on an alert pin but since the configuration doesn't stay I had
to resort to polling the temperature
