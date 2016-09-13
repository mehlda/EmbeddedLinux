#!/bin/bash
tempC = i2cget -y 2 0x49 00
tempF = $((($tempC * 9) / 5) + 32)
echo $tempF
