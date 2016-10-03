#!/bin/bash
echo Installing needed packages...
npm install require
npm install i2c@0.2.1
npm install util
npm install request
echo Finished installing packages
echo Running program...
./tempDataLog.js
