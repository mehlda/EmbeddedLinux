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
ptInputLeft = "P9_39"		# P9_39
ptInputRight = "P9_40"		# P9_40

stepper0 = "P9_11"		# P9_11
stepper1 = "P9_13"		# P9_13
stepper2 = "P9_15"		# P9_15
stepper3 = "P9_16"		# P9_16

startButton = "P9_12"	# P9_12

#use LEDS to mirror stepper output
led0 = "USR0"
led1 = "USR1"
led2 = "USR2"
led3 = "USR3"




# create initialization function
def setup():
	# Start button input
	GPIO.setup(startButton, GPIO.IN)
	GPIO.add_event_detect("P9_12", GPIO.FALLING)

	# Stepper outputs
	GPIO.setup(stepper0, GPIO.OUT)
	GPIO.setup(stepper1, GPIO.OUT)
	GPIO.setup(stepper2, GPIO.OUT)
	GPIO.setup(stepper3, GPIO.OUT)

	# LED outputs
	GPIO.setup(led0, GPIO.OUT)
	GPIO.setup(led1, GPIO.OUT)
	GPIO.setup(led2, GPIO.OUT)
	GPIO.setup(led3, GPIO.OUT)

def loop():
	if GPIO.input(led0):
		GPIO.output(led0, GPIO.LOW)
	else:
		GPIO.output(led0, GPIO.HIGH)

	if GPIO.input(led1):
		GPIO.output(led1, GPIO.LOW)
	else:
		GPIO.output(led1, GPIO.HIGH)

	time.sleep(.5)
	if GPIO.input(led2):
		GPIO.output(led2, GPIO.LOW)
	else:
		GPIO.output(led2, GPIO.HIGH)
		
	if GPIO.input(led3):
		GPIO.output(led3, GPIO.LOW)
	else:
		GPIO.output(led3, GPIO.HIGH)
	time.sleep(.5)

# Start

setup()


while True:
	loop()
	if GPIO.event_detected("P9_12"):
    	print "event detected!"


