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

