# Motor-Driven IR Finder
This was written by David Mehl (repo owner) and Sabeeh Khan. This homework's goal is to program a stepper motor to follow an IR led. We used a python library from Adafruit, the install guide is here:
https://learn.adafruit.com/setting-up-io-python-library-on-beaglebone-black/installation-on-ubuntu 

For hardware, we used a stepper motor and the L293 H-bridge. We hooked 1A of the bridge to P9_11 on the Beaglebone Black, 2A to P9_13, 3A to P9_15, 4A to P9_16. Next, we connected 1Y of the bridge to black of the stepper motor, 2Y to green, 3Y to red, and 4Y to orange. The stepper motor has two phototransistors glued to the wheel. Both of these transistors were pulled up to 1.8V using 10kOhm resistors then each went to an analog in pin on the bone. The infrared led that shines on the phototransistors was powered by +5V. 

To execute the program, run the following on the command line:
`python stepperSearch.py`

==========
Prof. Yoder's comments
Looks good and complete.

Grade:  10/10
