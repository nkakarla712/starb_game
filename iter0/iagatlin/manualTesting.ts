/**
 * Manual Test:
 * 
 * plan for manual testing of entire client/server system 
 *          (partitions and outline of manual test cases)
 * 
 * 
 *  * Manual test: add/remove star from board
 *      partition: adding star finishes game, adding star keeps game is unfinished state
 *  1. Be in the game
 *  2. Click on spot with star -> star should be removed
 *  3. Click on the same spot that is now blank -> star should be placed in the spot
 * 
 * 
 *  * Choose new board:
 *      partition: current game is not done, current game is done, no current game (first game to load)
 *  1. Click on new board from drop down
 *  2. Click "select"
 *  3. New empty board should be loaded on the board
 * 
 * 
 *  * Finish the game:
 *  1. Click on a empty space that puts a star that causes the game to finish due to a win
 *  2. Message appears that says, you won the game!
 * 
 */