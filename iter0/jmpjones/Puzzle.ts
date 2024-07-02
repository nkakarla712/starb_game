import assert from 'assert';

// Puzzle ADT specs + t.s.
// specs and testing strategy for puzzle ADT (no choosing tests or implementing)

enum SpotStatus {Star, Open, Unusable};

/**
 * Immutable ADT representing a Star Battle puzzle, as described in the project handout.
 * Coordinates are measured from the top left of the puzzle (0,0), increasing down and to the right. 
 */
class Puzzle {

    private readonly board: Array<SpotStatus>;
    private readonly regionToCoord: Map<number, Array<[number, number]>>

    // AF(board, regionToCoord) = a Star Battle board of size 10x10, where each spot in the board array x + (y * 10) 
    //                           is at the corresponding coords x,y on the puzzle board, has a status given by SpotStatus, 
    //                           and each region i is made up of the coords in regionToCoords[i].
    // RI = board.length === 100 && regionToCoord.keys.length === 10 && sum(regionToCoord.values.length) === 100
    // Safety from Rep Exposure: 
    //   board and regionToCoord are both private and readonly
    //   getCoordStatus returns immutable SpotStatus objects
    //   placeStar returns an entirely new Puzzle without aliasing

    /**
     * Returns a new puzzle representing the current board with a new star placed
     * 
     * @param xCoord the x coordinate at which to place the new star. Must be 0-9.
     * @param yCoord the y coordinate at which to place the new star. Must be 0-9.
     * 
     * @returns a new Puzzle object representing the new board with the new star on it. 
     * Throws an error if a star cannot be placed at the given coordinate.
     */
    public placeStar(xCoord:number, yCoord:number): Puzzle {
    };

    /**
     * Returns the status of the given coordinate on the board. 
     * 
     * @param xCoord the x coordinate at which to check status. Must be 0-9.
     * @param yCoord the y coordinate at which to check status. Must be 0-9.
     * 
     * @returns the status of the given coordinate
     */
    public getCoordStatus(xCoord:number, yCoord:number): SpotStatus {
    };
};

//Puzzle testing strategy
//  place Star(), getCoordStatus():
//      partition on type of board: unsolved, partially solved, fully solved
//      partition on type of status: Star, Open, Unusable
//          if unusable, partition on why unusable: full region, full column, full row, adjacent star