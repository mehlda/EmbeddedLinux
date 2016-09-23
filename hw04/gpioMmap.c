/*
 * gpioMmap.c 
 * Author: David Mehl
 * 
 * Simple program to manipulate GPIO using the mmap() command
*/

#include <stdio.h>
#include <stdlib.h>
#include <mman.h>
#include <stat.h>
#include <fcntl.h> 

#define GPIO0_BASE 0x44E07000
#define GPIO1_BASE 0x4804C000
#define GPIO2_BASE 0x481AC000
#define GPIO3_BASE 0x481AE000
#define GPIO_SIZE  0x2000

#define GPIO_SETDATAOUT 0x194
#define GPIO_CLEARDATAOUT 0x190

#define USR3 (1<<24)

int main(){
	volatile void * gpioAddr;
	volatile unsigned int * gpioSetDataOutAddr, * gpioClearDataOutAddr;
	int fd = open("/dev/mem", 0_RDWR);

	gpioAddr = mmap(0, GPIO_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, GPIO1_BASE);

	gpioSetDataOutAddr = gpioAddr + GPIO_SETDATAOUT;
	gpioClearDataOutAddr = gpioAddr + GPIO_CLEARDATAOUT;
	while(1){
		*gpioSetDataOutAddr = USR3;
		*gpioClearDataOutAddr = USR3;
	}
	return 0;
}