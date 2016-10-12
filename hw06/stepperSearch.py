# stepperSearch.py
# Authors: David Mehl and Sabeeh Khan
# Simple control of stepper motor to find IR light sources

#import py library
import Adafruit_BBIO.GPIO as GPIO
import Adafruit_BBIO.ADC as ADC
import time

#prepares the ADC
ADC.setup()

# define global variables/constants, mainly pin numbers
# 'pt' will be short for phototransistor
ptInputLeft = "P9_39"		# P9_39
ptInputRight = "P9_40"		# P9_40

# Four stepper motor controls
stepper0 = "P9_11"		# P9_11
stepper1 = "P9_13"		# P9_15
stepper2 = "P9_15"		# P9_13
stepper3 = "P9_16"		# P9_16

# Button for start control
startButton = "P9_12"	# P9_12


# Movement sequence for stepper motor. Traversing forward is counter-clockwise, 
# traversing backwards is clockwise
sequence = (0xC,0x6,0x3,0x9)

# Array traversal values
clockwise = -1
counterClockwise = 1

#current step state, to be used for search and follow modes
state = 0



# create initialization function
def setup():
	# Start button input
	GPIO.setup(startButton, GPIO.IN)
	GPIO.add_event_detect(startButton, GPIO.FALLING)

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



# Start

# Moves the stepper one step in the given direction
def step(direction):
	global state
	state = state + direction
	if(state < 0):
		state = 3
	elif(state > 3):
		state = 0
	if((sequence[state] >> 3) & 0x1):
		GPIO.output(stepper0, GPIO.HIGH)
	else:
		GPIO.output(stepper0, GPIO.LOW)
	if((sequence[state] >> 2) & 0x1):
		GPIO.output(stepper1, GPIO.HIGH)
	else:
		GPIO.output(stepper1, GPIO.LOW)
	if((sequence[state] >> 1) & 0x1):
		GPIO.output(stepper2, GPIO.HIGH)
	else:
		GPIO.output(stepper2, GPIO.LOW)
	if((sequence[state] >> 0) & 0x1):
		GPIO.output(stepper3, GPIO.HIGH)
	else:
		GPIO.output(stepper3, GPIO.LOW)
	time.sleep(.05)

# revolves the stepper motor in the given direction
def revolve(direction):
	for i in range(20):
		step(direction)

# Returns the lowest position detected
def searchLowest():
	lowest_position = 0
	lowest_value = 4096
	for i in range(20):
		step(clockwise)
		pt1val = ADC.read(ptInputLeft)
		pt2val = ADC.read(ptInputRight)
		avg = (pt1val + pt2val) / 2
		if (avg < lowest_value):
			lowest_value = avg
			lowest_position = i
	return lowest_position

#moves the stepper to the lowest position
def gotoLowest(num_pos):
	for i in range(20 - num_pos):
		step(counterClockwise)
	time.sleep(1)

# Moves the stepper towards the direction of the most intense
# IR light
def track():
	ptLeftValue = ADC.read(ptInputLeft)
	ptRightValue = ADC.read(ptInputRight)
	if(ptLeftValue < ptRightValue):
		step(clockwise)
	else:
		step(counterClockwise)

# Runs the code
def loop():
	print "starting"
	#revolve(clockwise) #phase 1 
	#revolve(counterClockwise) #Need for phase 1
	position = searchLowest()
	gotoLowest(position)

	while True:
		track()
	
	
# Run the setup code
setup()

# Loops here
while True:
	# wait for button press to start
	GPIO.wait_for_edge(startButton, GPIO.RISING)
	loop()
