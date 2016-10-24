/*
 * gpioMmap.c 
 * Author: David Mehl
 * 
 * Simple program to copy a GPIO to another using the mmap() command
*/

#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h> 
#include <signal.h>

//Defines from the TRM
#define GPIO0_BASE 0x44E07000
#define GPIO1_BASE 0x4804C000
#define GPIO2_BASE 0x481AC000
#define GPIO3_BASE 0x481AE000
#define GPIO_SIZE  0x2000

#define GPIO_DATAIN 0x138
#define GPIO_SETDATAOUT 0x194
#define GPIO_CLEARDATAOUT 0x190

#define USR2 (1<<23) // GPIO port 1
#define USR3 (1<<24) // GPIO port 1

#define LEADER (1<<14) //P9_26, GPIO port 0
#define FOLLOWER (1<<19) //P9_27, GPIO port 3


int main(){

	//Declare the memory pointers
	printf("Declaring Variables...\n");
	volatile void * gpioAddr0, * gpioAddr1;
	volatile unsigned int *gpioClearDataOutAddr0, * gpioClearDataOutAddr1;
	volatile unsigned int * gpioSetDataOutAddr0,* gpioSetDataOutAddr1;
	volatile unsigned int * gpioDataIn0, *gpioDataIn1;

	//Get the memory map file
	printf("Opening /dev/mem...\n");
	int fd = open("/dev/mem", O_RDWR);

	//Get the mapped pointers
	printf("Calling mmap...\n");
	gpioAddr0 = mmap(0, GPIO_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, GPIO0_BASE);
	gpioAddr3 = mmap(0, GPIO_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, GPIO3_BASE);

	//Build up the pointers we need
	printf("Creating pointers...\n");
	gpioSetDataOutAddr0 = gpioAddr0 + GPIO_SETDATAOUT;
	gpioClearDataOutAddr0 = gpioAddr0 + GPIO_CLEARDATAOUT;

	gpioSetDataOutAddr3 = gpioAddr3 + GPIO_SETDATAOUT;
	gpioClearDataOutAddr3 = gpioAddr3 + GPIO_CLEARDATAOUT;

	gpioDataIn0 = gpioAddr0 + GPIO_DATAIN;
	gpioDataIn3 = gpioAddr3 + GPIO_DATAIN;

	//Check the two switches/buttons, and set the usr leds when appropriate
	printf("Starting...\n");
	while(1){
		if(*gpioDataIn0 & LEADER){
			*gpioSetDataOutAddr3 = FOLLOWER;
		} else {
			*gpioClearDataOutAddr3 = FOLLOWER;
		}
	}
	return 0;
}


