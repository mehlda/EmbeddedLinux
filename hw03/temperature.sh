#!/bin/bash
declare tempC 
declare tempF
tempC = i2cget -y 2 0x49 00
tempF = $(($tempC * 9))
tempF = $(($tempF / 5))
tempF = $((tempF + 32))
echo $tempF