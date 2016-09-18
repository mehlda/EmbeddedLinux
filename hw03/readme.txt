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
presses on the beaglebone. The two temperature sensors are configured to the same
thresholds for interrupts. When they get above 28 C they will trigger the interrupt,
and when they drop below 26 C they will reset the interrupt. When the sensor with
address 0x49 triggers an interrupt, the display will be erased. When the sensor with
address 0x48 triggers an interrupt, the display will begin drawing in the opposite color.
Initially, the display will print green. When a color change occurs, or an erase event
occurs, the console will notify the user. When the terminal prints "Ready!" the code is
initialized. Simply run the included install.sh  file to install the needed npm packages and 
run the program. Use the quit button on a breadboard or Ctrl-C to quit the program. Wire 
buttons for up, down, left, and right movement, as well as quit, and the LED matrix for the 
display, and the TMP101 sensors for erase, instructions below.

Etch-a-Sketch Wiring instructions:
Place 5 normally-open buttons on a breadboard. Wire one side of each button to 3.3 V. Wire
the other side of the buttons to pins P9_12, P9_14, P9_16, P9_18, and P9_22 to serve as
up, down, left, right, and quit buttons, respectively. Place the LED matrix on the breadboard
and connect SCL to P9_19, SDA to P9_20, and connect power and ground properly. Attach 4.7k
pullup resistors to the SCL and SDA lines. Wire a TMP101 i2c temperature sensor to the same
i2c pins on the bone, and leave the ADD0 pin floating to allow for address 0x49. Attach this
sensor's alert pin to P9_26. Wire another TMP101 i2c temperature sensor, with the ADD0 pin 
grounded to get address 0x48. Attach this sensors alert pin to P9_27. You may need external 
pullup resistors on the alert pins of the TMP101 sensors. The code is supposed to enable them,
however they are not functioning properly on my device
===========================================================================================

