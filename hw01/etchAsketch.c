#include<curses.h>
#include<stdlib.h>
#include<stdio.h>

WINDOW * createGameWindow(int x, int y, int w, int h);
void getUserParameters(int * w, int * h, int * tr);
void printInstructions(int startX, int startY, int width, int height);
void gameHandler(WINDOW * win, int width, int height, char tracer);

#define CURSOR_INVISIBLE 0
#define FRAME_SIZE_ADJUSTMENT 2

#define DECIMAL 10

#define MINIMUM_SIZE_INPUT 2

#define CURSOR_START_X 1
#define CURSOR_START_Y 1

#define WINDOW_START_X 0
#define WINDOW_START_Y 1

int main(){
	//Initialize variables
	WINDOW * win;
	int startX, startY, width, height, tracer;
	startX = WINDOW_START_X;
	startY = WINDOW_START_Y;
	
	//Initialize curses
	initscr();
	raw();

	//Get important constants from the user
	getUserParameters(&width, &height, &tracer);

	//Turn off echo and hide the cursor now. Then clear the terminal
	noecho();
	curs_set(CURSOR_INVISIBLE);
	clear();
	refresh();

	//Get the game window and draw it in the terminal
	win = createGameWindow(startX, startY, width, height);
	wrefresh(win);

	//Add the instructions to the terminal
	printInstructions(startX, startY, width, height);

	//Run the game
	gameHandler(win, width, height, (char)tracer);


	//Clean up and close down
	delwin(win);
	refresh();
	endwin();
	return 0;
}

/*
 * Creates, draws, and returns the game window
 *
 * @param x X coordinate at which to draw the window
 * @param y Y coordinate at which to draw the window
 * @param w Width of the window
 * @param h Height of the window
*/ 
WINDOW * createGameWindow(int x, int y, int w, int h){
	WINDOW * temp;
	temp = newwin(h, w, y, x);
	box(temp, 0, 0);
	wrefresh(temp);
	return temp;
}


/*
 * Gets the user input parameters for the size of the game and what tracer to use
 *
 * @param w Pointer to the int width
 * @param h Pointer to the int height
 * @param tr Pointer to the int tracer
 *
*/ 
void getUserParameters(int * w, int * h, int * tr){
		//Initialize char array, hopefully input won't be large than this
		char input[80];

		//Get the width from the user
		while(TRUE){
		printw("Enter width of etch-a-sketch(i.e. 40):\n");
		refresh();
		getstr(input);
		char * endpt;
		long number = strtol(input, &endpt, DECIMAL);

		if(number >= MINIMUM_SIZE_INPUT){
			//Adjust so the drawable space is as the user requested
			*w = number + FRAME_SIZE_ADJUSTMENT;
			break;
		} else {
			printw("Invalid input. Try again\n");
			refresh();
		}
	}
	clear();

	//Get the height from the user
	while(TRUE){
		printw("Enter height of etch-a-sketch(i.e. 15):\n");
		refresh();
		getstr(input);
		char * endpt;
		long number = strtol(input, &endpt, DECIMAL);

		if(number >= MINIMUM_SIZE_INPUT){
			//Adjust so the drawable space is as the user requested
			*h = number + FRAME_SIZE_ADJUSTMENT;
			break;
		} else {
			printw("Invalid input. Try again\n");
			refresh();
		}
	}
	clear();

	//Get the tracer from the user
	printw("Enter desired tracer of etch-a-sketch:\n");
	refresh();
	*tr = getch();
	clear();
	
}

/*
 * Prints the game title and instructions on the terminal
 *
 * @param startX The x start coordinate of the game window
 * @param startY The y start coordinate of the game window
 * @param width The width of the game window
 * @param height The height of the game window
*/ 
void printInstructions(int startX, int startY, int width, int height){
	mvprintw(0,0, "Etch-A-Sketch Game");
	mvprintw(startY + height, startX, "Instructions:");
	mvprintw(startY + height + 1, startX, "Use the arrow keys to move");
	mvprintw(startY + height + 2, startX, "Press the space bar to 'shake'(erase)");
	mvprintw(startY + height + 3, startX, "Press 'q' to quit");
}

/*
 * Handles the running of the game
 *
 * @param win The window to draw the tracer in
 * @param width The width of the window supplied
 * @param height The height of the window supplied
 * @param tracer The character to use as the tracer
 *
*/ 
void gameHandler(WINDOW * win, int width, int height, char tracer){
	//Initialize and set boundaries for the tracer
	int boundTop, boundBottom, boundLeft, boundRight;
	boundTop = CURSOR_START_Y;
	boundBottom = height - FRAME_SIZE_ADJUSTMENT;
	boundLeft = CURSOR_START_X;
	boundRight = width - FRAME_SIZE_ADJUSTMENT;

	//Initialize and set the initial cursor location at the upper left boundary
	int cursorRow, cursorColumn;
	cursorRow = boundTop;
	cursorColumn = boundLeft;

	//Enable detection of special KEY_ defines
	keypad(stdscr, TRUE);

	//Handle user inputs to the game
	while(TRUE){
		int key = getch();
		switch(key){
			case 'q':
				//Quit
				return;
				break;
			case KEY_LEFT:
				//If possible, go left
				if(cursorColumn > boundLeft){
					cursorColumn--;
					mvwaddch(win, cursorRow, cursorColumn, tracer);
					wrefresh(win);
				}
				break;
			case KEY_RIGHT:
				//If possible, go right
				if(cursorColumn < boundRight){
					cursorColumn++;
					mvwaddch(win, cursorRow, cursorColumn, tracer);
					wrefresh(win);
				}
				break;
			case KEY_UP:
				//If possible, go up
				if(cursorRow > boundTop){
					cursorRow--;
					mvwaddch(win, cursorRow, cursorColumn, tracer);
					wrefresh(win);
				}
				break;
			case KEY_DOWN:
				//If possible, go down
				if(cursorRow < boundBottom){
					cursorRow++;
					mvwaddch(win, cursorRow, cursorColumn, tracer);
					wrefresh(win);
				}
				break;
			case ' ':
				//Shake received, so clear the window and redraw the outline
				werase(win);
				box(win,0,0);
				wrefresh(win);
				break;
			default:
				//Unhandled character entered. Ignore it
				break;
		}
	}
}