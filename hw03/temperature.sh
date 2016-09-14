#!/bin/bash
temp=`i2cget -y 2 0x49`
temp=$(($temp*9))
temp=$(($temp/5))
temp=$(($temp+32))
echo $temp
