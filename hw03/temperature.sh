#!/bin/bash
i2cset -y 2 0x49 0x02 0x10
i2cset -y 2 0x49 0x03 0x1D
i2cset -y 2 0x49 0x01 0x00
i2cset -y 2 0x49 0x00
temp=`i2cget -y 2 0x49`
temp=$(($temp*9))
temp=$(($temp/5))
temp=$(($temp+32))
echo $temp
