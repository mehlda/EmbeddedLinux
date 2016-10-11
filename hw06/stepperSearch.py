# stepperSearch.py
# Authors: David Mehl and Sabeeh Khan
# Simple control of stepper motor to find IR light sources

#import py library
import Adafruit_BBIO.GPIO as GPIO
import Adafruit_BBIO.ADC as ADC
import time


ADC.setup()

# define global variables/constants, mainly pin numbers
# 'pt' will be short for phototransistor
ptInputLeft = "AIN0"		# P9_39
ptInputRight = "AIN1"		# P9_40

stepper0 = "GPIO0_30"		# P9_11
stepper1 = "GPIO0_31"		# P9_13
stepper2 = "GPIO1_16"		# P9_15
stepper3 = "GPIO1_19"		# P9_16

startButton = "GPIO1_28"	# P9_12

#use LEDS to mirror stepper output
led0 = "USR0"
led1 = "USR1"
led2 = "USR2"
led3 = "USR3"




# create initialization function
def setup():
	# Start button input
	GPIO.setup(startButton, INPUT)
	GPIO.add_event_detect("P9_12", GPIO.FALLING)

	if GPIO.event_detected("P9_12"):
	    print "event detected!"

	# Stepper outputs
	GPIO.setup(stepper0, OUTPUT)
	GPIO.setup(stepper1, OUTPUT)
	GPIO.setup(stepper2, OUTPUT)
	GPIO.setup(stepper3, OUTPUT)

	# LED outputs
	GPIO.setup(led0, OUTPUT)
	GPIO.setup(led1, OUTPUT)
	GPIO.setup(led2, OUTPUT)
	GPIO.setup(led3, OUTPUT)

def loop():
	if GPIO.input(led0):
		GPIO.output(led0, LOW)
	else:
		GPIO.output(led0, HIGH)

	if GPIO.input(led1):
		GPIO.output(led1, LOW)
	else:
		GPIO.output(led1, HIGH)

	time.sleep(.5)
	if GPIO.input(led2):
		GPIO.output(led2, LOW)
	else:
		GPIO.output(led2, HIGH)
		
	if GPIO.input(led3):
		GPIO.output(led3, LOW)
	else:
		GPIO.output(led3, HIGH)
	time.sleep(.5)

# Start

setup()

while True:
	loop()

