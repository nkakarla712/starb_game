

import assert from 'assert';
import fs from 'fs';

/**
 * Immutable ADT for a 10x10 Star Battle game with one unique solution
 */
export class Puzzle {

    //
    // Abstraction function:
    //   AF(regionArray, starArray) = a 10x10 gameboard of Star Battle, where each region of the puzzle is
    //                                denoted by unique integer 0-9 in the 1D array "regionArray", which stores
    //                                a 2D game board in row-major order. "starArray" is another array where a true
    //                                value in the array represents the presence of a star, and false represents the
    //                                absence of a star, again stored in row-major order.
    //
    // Representation invariant:
    //   - len(boardArray) === len(starArray) === 100
    //   - regionArray contains numbers from 0-9, and regions are contiguous as defined as all squares
    //     of a region are adjecent to eachother
    //   - 
    //   
    // Safety from rep exposure:
    //   copies of the rep are used in producer functions, 
    //

    /**
     * @param regionArray an 100 element array
     * @param starArray an 100 element array 
     * // add an array for answer, starAnswerArray, then we can just compare the locations of the stars in 
     *                                              the array to determine if the board is winning
     */
    public constructor (
        private readonly regionArray: Array<number>,
        private readonly starArray: Array<boolean>,
    ) {

    }

    private checkRep(): void {
        assert(true);
    }

    /**
     * 
     * @returns a new Puzzle object with the opposite state in position (row, column)
     */
    public toggleStar(row: number, column: number): Puzzle {
        return new Puzzle([], []);
    }

    /**
     * 
     * @returns true iff the game board is blank ie. contains no stars, otherwise false
     */
    private isBlank(): boolean {
        return true;
    }

    /**
     * 
     * @returns true iff the game board is solved based on the rules of Star Battle, otherwise false
     */
    private isSolved(): boolean {
        return true;
    }

    /**
     * 
     * @returns a parseable string representation of the ADT
     * @throws error if the puzzle is not blank or solved
     */
    public stringRep(): string{
        return "";
    }

    /**
     * 
     * @returns a human readable representation of the ADT
     */
    public toString(): string{
        return "";
    }
}