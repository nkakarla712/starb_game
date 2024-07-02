// Your system must use an immutable puzzle ADT that can represent valid unsolved, 
// partially-solved, and fully-solved puzzles. Its design is otherwise up to you.
// Your client web page must use another client ADT to manage its state (for example, what puzzle is being played, using the puzzle ADT) 
// and operations (for example, in reaction to user input). Its design is entirely up to you.

import { SpotStatus, Puzzle } from './puzzle'

/**
 * Mutable Client ADT, as described in the Star Battle project handout. 
 */
class Client {

    // AF(puzzle) = a client interacting with a Star Board Puzzle represented by puzzle
    // RI = true
    // Safety from Rep Exposure: 
    //   puzzle is private and immutable

    private puzzle: Puzzle;

    //checks that the rep invariant is true
    private checkRep(): void {
    }

    /**
     * Sets the puzzle attribute of the client to a new puzzle with star toggled
     * 
     * @param xCoord the x coordinate at which to add/remove the new star. Must be 1-10.
     * @param yCoord the y coordinate at which to add/remove the new star. Must be 1-10.
     */
    public toggleStar(xCoord:number, yCoord: number): void {
    }

    /**
     * Returns the status of the given coordinate on the board. 
     * 
     * @param xCoord the x coordinate at which to check status. Must be 0-9.
     * @param yCoord the y coordinate at which to check status. Must be 0-9.
     * 
     * @returns the status of the given coordinate
     */
    public getSpotStatus(xCoord:number, yCoord:number): SpotStatus {
    }

    /**
     * Returns a drawing of the client's puzzle, as depicted in the Star Battle handout
     */
    public drawPuzzle(): Canvas {
    }

    /**
     * Returns true if the current puzzle used by the client is solved
     */
    public isPuzzleSolved(): boolean {
    }
};