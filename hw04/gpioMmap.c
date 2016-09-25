/*
 * gpioMmap.c 
 * Author: David Mehl
 * Sig Int written by Mark A. Yoder
 * 
 * Simple program to manipulate GPIO using the mmap() command
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

#define SWITCH0 (1<<31) //P9_13, GPIO port 0
#define SWITCH1 (1<<16) //P9_15, GPIO port 1

//Variable to control loop
int active = 1;

//Sig Int handler written by Mark A. Yoder
void signal_handler(int sig)
{
    printf( "\nCtrl-C pressed, cleaning up and exiting...\n" );
	keepgoing = 0;
}


int main(){
	// Use Dr. Yoder's Sig Int handler
	signal(SIGINT, signal_handler);

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
	gpioAddr1 = mmap(0, GPIO_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, GPIO1_BASE);

	//Build up the pointers we need
	printf("Creating pointers...\n");
	gpioSetDataOutAddr0 = gpioAddr0 + GPIO_SETDATAOUT;
	gpioClearDataOutAddr0 = gpioAddr0 + GPIO_CLEARDATAOUT;

	gpioSetDataOutAddr1 = gpioAddr1 + GPIO_SETDATAOUT;
	gpioClearDataOutAddr1 = gpioAddr1 + GPIO_CLEARDATAOUT;

	gpioDataIn0 = gpioAddr0 + GPIO_DATAIN;
	gpioDataIn1 = gpioAddr1 + GPIO_DATAIN;

	//Check the two switches/buttons, and set the usr leds when appropriate
	printf("Starting...\n");
	while(active){
		if(*gpioDataIn0 & SWITCH0){
			*gpioSetDataOutAddr1 = USR2;
		} else {
			*gpioClearDataOutAddr1 = USR2;
		}
		if(*gpioDataIn1 & SWITCH1){
			*gpioSetDataOutAddr1 = USR3;
		} else {
			*gpioClearDataOutAddr1 = USR3;
		}
	}

	//Unmap the memory and end the program
	munmap((void *)gpioAddr0, GPIO_SIZE);
	munmap((void *)gpioAddr1, GPIO_SIZE);
	close(fd);
	return 0;
}