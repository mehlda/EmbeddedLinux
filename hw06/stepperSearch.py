# stepperSearch.py
# Authors: David Mehl and Sabeeh Khan
# Simple control of stepper motor to find IR light sources

#import py library
from bbio import *

# define global variables/constants, mainly pin numbers
# 'pt' will be short for phototransistor
ptInputLeft = AIN0		# P9_39
ptInputRight = AIN1		# P9_40

stepper0 = GPIO0_30		# P9_11
stepper1 = GPIO0_31		# P9_13
stepper2 = GPIO1_16		# P9_15
stepper3 = GPIO1_19		# P9_16

startButton = GPIO1_28	# P9_12

#use LEDS to mirror stepper output
led0 = USR0
led1 = USR1
led2 = USR2
led3 = USR3



# create initialization function
def setup():
	# Start button input
	pinMode(startButton, INPUT)

	# Stepper outputs
	pinMode(stepper0, OUTPUT)
	pinMode(stepper1, OUTPUT)
	pinMode(stepper2, OUTPUT)
	pinMode(stepper3, OUTPUT)

	# LED outputs
	pinMode(led0, OUTPUT)
	pinMode(led1, OUTPUT)
	pinMode(led2, OUTPUT)
	pinMode(led3, OUTPUT)

def loop():
	toggle(led0)
	toggle(led1)
	delay(500)
	toggle(led2)
	toggle(led3)
	delay(500)

# Start
run(setup, loop)