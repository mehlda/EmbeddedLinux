# Makefile

-include ./path.mak

# --------------------------------
# ------ user-defined vars -------
# --------------------------------
CFLAGS:= -g -O3
CC:= $(LINUXarm_GCC)


# -----------------------
# ------ make all -------
# ----------------------- 

.PHONY: all
all: gpioMmap.arm



# -----------------------------------
# ------ executable rule (.x) -------
# -----------------------------------
gpioMmap.arm : gpioMmap.o
	$(CC) $(CFLAGS) $(LINKER_FLAGS) $^ -o $@
	@echo Successfully created $@




# ---------------------------------------------------
# ------ intermeditate object files rule (.o) -------
# ---------------------------------------------------
# gcc  compiler flag c file all dependency output target
%.o : %.c
	$(CC) $(CFLAGS) -c $^ -o $@
	@echo Successfully created $@
	
	
	
# ----------------------)
# ----- clean all ------
# ----------------------

# The "clean" rule should remove all files created by
# the makefile (e.g. the executables and intermediate
# files).
.PHONY: clean
clean: *.o *.arm
	$(RM) $^


	


# -------------------------------------
# ----- basic debug for Makefile ------
#
# -----     example only         ------
# -------------------------------------

# We use test to print out the user-defined variables to
# make sure they are set properly - this helps with 
# debugging makefile errors.

.PHONY: test
test:
	@echo CC = $(CC)
	@echo CFLAGS = $(CFLAGS)
	
