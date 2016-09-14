#!/bin/bash
let temp = 'i2cget -y 2 0x49 00'
let temp = temp \* 9
let temp = temp / 5
let temp = temp + 32
echo $temp