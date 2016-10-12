**************
Makefile, app.c, path.mak, crossCompile.sh
This is my completed makefile as well as the makefile paths file and the source file
to be compiled, taken from the exercises folder, and a script to define variables for
cross compiling. use 'source crossCompile.sh' and then 'make' to compile for the bone
on the host computer. The output for the two programs can be seen below:

Output from bone:
root@beaglebone:~# ./a.out 
Hello, World! Main is executing at 0x103d5
This address (0xbefd6bf4) is in our stack frame
This address (0x20668) is in our bss section
This address (0x20660) is in our data section

Output from host:
mehl@mehl-ThinkPad-W540 ~/Desktop/embedded_linux/exercises $ ./a.out 
Hello, World! Main is executing at 0x400596
This address (0x7ffe90a7b940) is in our stack frame
This address (0x601048) is in our bss section
This address (0x601040) is in our data section

**************
install.sh, tempDataLog.js, keys_tmp101.json
install.sh will install all node.js packages needed and will run tempDataLog.js.
tempDataLog.js will record temperature values to data.sparkfun.com once every second. 
It uses TMP101 senors with addresses 0x49 and 0x48 on i2c-2 on the beaglebone black. 
This bus is on P9_19 and P9_20. keys_tmp101.json contains the keys for interacting with
the sparkfun site.

**************
plotTMP101.html
This file has been modified from the given file in order to pull data from my own data
on the sparkfun site. Open with a web browser to see the data

**************
The kernel compiled successfully by following the provided instructions

==========
Prof. Yoder's comments
Looks good and complete.

Grade:  10/10
