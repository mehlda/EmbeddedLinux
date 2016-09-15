#!/bin/bash
echo install i2c node.js package
npm install i2c@0.2.1
chmod +x etchAsketch.js
echo Running...
echo ready will display when the code is initialized
./etchAsketch.js
