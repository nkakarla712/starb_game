/**
 * interface for the puzzle ADT that can represent valid unsolved, partially-solved, and fully-solved puzzles.
 */
interface Puzzle{

    /**
     * Adds a star to the given cell
     * @param row row value to add star
     * @param col column value to add star
     * @throws error if the star can not be put at the given spot
     */
    addStar(row: number, col: number): void
    
    /**
     * marks the given spot as not a star location
     * @param row row value to add the no star marker
     * @param col col value to add the no star marker
     */
    markNoStar(row:number, col: number): void

    /**
     * Returns the cell status of a given cell to see if it is empty, unsolved, or has a star
     * @param row row value of the cell to check
     * @param col col value of the cell to check
     * @return string that represents status of the cell
     */
    getCellStatus(row: number, col: number): string

    /**
     * Undoes the previous action
     */
    undoAction(): void

    /**
     * Resets the board to a new blank board
     */
    resetBoard(): void  

    /**
     * Returns if this current puzzle is equal to the inputted one
     * @param puzzle other puzzle object
     * @returns boolean that is true if they are the same object and false otherwise
     */
    equalValue(puzzle: Puzzle): boolean 

    /**
     * Returns string representation of the puzzle including current states and show values
     */
    toString(): string

}


//Testing Strategy
//Partition on addStar
//  is valid add star
//  is not valid add star
//Partition on markNoStar
//  is valid add no star marker
//  is not valid add no star marker
//Partition on getCellStatus
//  cell is invalid (<0, >size of board)
//  cell has star
//  cell has mark no star
//  cell is empty
//Partition on undoAction
//  undo each type of action (add star, no mark star, reset board)
//  unod on first move (should throw error)
