#!/bin/bash
echo Installing needed packages...
npm install require
npm install i2c
npm install util
npm install request
echo Finished installing packages
echo Running program...
./tempDataLog.js
