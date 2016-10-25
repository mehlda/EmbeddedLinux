# Homework 07
***************************************************************************************************************
User instructions below by directory:
##hw07/ :
This directory contains the directories 'kernel', 'mmap', and 'pru'.

###MethodResults.pdf:
This file contains the documentation and data on the comparison between the 4 different methods of GPIO copying.

###scope_mmap.png:
This is a scope image captured during the MMAP testing.

###scope_pru.png:
This is the scope image captured during the PRU testing.

###gpioNode.js:
Run this program by executing `./gpioNode.js`
This is the Node.js program that copies P9_24 to P9_27 using interrupts. Information on its performance can be found in MethodResults.pdf. The program is set to kill itself after 10 seconds to avoid locking up the CPU during testing. Be aware that a high enough frequency during testing will lock up the CPU due to the interrupts used by this program. To recover, turn off the function generator and the CPU should become usable again.


##hw07/mmap :

###Makefile:
This is the Makefile for the MMAP C program that copies P9_24 to P9_27. Execute `make` to compile the project. Use `make clean` to remove old files.

###gpioMmap.arm:
This is the executable program that copies the GPIO pins. Run `make clean` to clear.

###gpioMmap.c:
This is the source code for the program.

###gpioMmap.o:
This is the object file used by gcc to compile the executable. Run `make clean` to clear.


##hw07/kernel:

###Makefile:
This is the Makefile for the kernel module that copies GPIO P9_24 to P9_27. Execute `make` to compile.

###gpio_test.c:
This is the source code for the kernel module.

###gpio_test.ko:
This is the Linux Kernel Module that copies P9_24 to P9_27. Execute `insmod gpio_test.ko` to begin the module's functionality. When finished, execute `rmmod gpio_test` to remove the module.


##hw07/pru:

###setup.sh:
This file configures the pins P9_24 and P9_27 to be used by the PRU as an input and output, respectively. Execute `source setup.sh` to use this file.

###Makefile:
This is the Makefile for the PRU program that copies P9_24 to P9_27. Exectute `make` and then execute `make install` to start the code on PRU0. Be sure to execute `source setup.sh` or the pins will not respond to the PRU.

###main_pru0.c:
This file contains the source code for the GPIO copy.

###other files:
The other files are either used as includes for compiling the code or are unused. I have included them as they were used in the original program that I have modified to fulfill a different purpose.

##Testing Procedure:
To test the above programs, a 1 kHz square wave was placed on P9_24 and both this input and the output on P9_27 were monitored using an oscilloscope. The delay between a rise in the input and the corresponding rise in the output were measured, as was the delay on the falling edge. CPU usage was determined using `htop` and the average delay was determined by sampling several waveforms and determining the typical delay. Full results can be found in MethodResults.pdf