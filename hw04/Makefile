# Simple Makefile for the mmap program

CFLAGS := -O3

all: gpioMmap

gpioMmap: gpioMmap.c
	@echo Compiling gpioMmap
	@$(CC) $(CFLAGS) -o $@  $<
	@echo Compiling completed

clean:
	@echo Cleaning gpioMmap
	@rm gpioMmap
	@echo Finished cleaning Up