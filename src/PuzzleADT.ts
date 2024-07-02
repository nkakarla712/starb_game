import assert from 'assert';

const PUZZLE_SIZE = 10;

/**
 * A mutable spot object that represents a location where a star can be placed in the game Star Battle, it also
 * has a defined region it belongs to.
 */
export class Spot{

    // AF(row, column, star, region) = a spot on a gameboard of star battle at the row 'row' and column 'column'
    //                                 the spot belongs to the region 'region' and has a star at the spot if 'star'
    //                                 is true, otherwise it doesn't have a star
    //
    // RI:
    //   1 <= (row, column, & region) <= 10
    //   
    // SRE: 
    //   All instance variables are immutable, private and only star is not readonly. No opeations except getAdjacent return mutable types
    //   so safe from rep exposure and all inputs to constructor are also immutable
    //   getAdjacent does not return any of the rep and simply returns a new array of immutable objects so safe from rep exposure

    /**
     * Creates a spot with the values given to it
     * 
     * @param row row coordinate that the spot is located at
     * @param column column coordinate that the spot is located at
     * @param star true if there is a star at this spot on the gameboard
     * @param region region that the spot belongs to
     */
    public constructor(private readonly row: number, 
                       private readonly column: number, 
                       private star: boolean,
                       private readonly region: number) {
        this.checkRep();
    }
    
    private checkRep(): void {
        assert(this.row >= 1 && this.row <= PUZZLE_SIZE);
        assert(this.column >= 1 && this.column <= PUZZLE_SIZE);
        assert(this.region >= 1 && this.region <= PUZZLE_SIZE);
    }

    /**
     * @returns row of spot. will be between 1-10 inclusive
     */
    public getRow(): number {
        this.checkRep();
        return this.row;
    }

    /**
     * @returns column of spot. will be between 1-10 inclusive
     */
    public getColumn(): number {
        this.checkRep();
        return this.column;
    }

    /**
     * changes the boolean of the star to the opposite state
     */
    public toggleStar(): void {
        this.star = !this.star;
        this.checkRep();
    }

    /**
     * @returns true iff the spot has a star at it, otherwise false
     */
    public hasStar(): boolean {
        this.checkRep();
        return this.star;
    }

    /**
     * @returns region of spot. will be between 1-10 inclusive
     */
    public getRegion(): number {
        this.checkRep();
        return this.region;
    }

    /**
     * Gets the list of coordiantes of adjacent spots to the current spot
     * 
     * @returns list of coordinate pairs that represent all valid adjacent spots (horizontally, vertically, and diagonally) to the 
     *          current spot object. Omits any spots that are outside the range of the board or equal to the spot itself.
     */
    public getAdjacent(): Array<[number, number]>{
        this.checkRep();
        
        //get all adjacent spots
        const allSpots: Array<[number, number]> = [];
        for (const x of [-1,0,1]){
            for (const y of [-1,0,1]){
                allSpots.push([this.getRow() + x, this.getColumn() + y]);
            }
        }

        //construct new array that only has valid adjacent boxes
        const filteredArr:Array<[number, number]> = [];
        for (const coord of allSpots){
            let toAdd = true;
            if (coord[0] === this.getRow() && coord[1] === this.getColumn()){
                toAdd = false;
            }
            if(coord[0] < 1 || coord[0] > PUZZLE_SIZE){
                toAdd = false;
            }
            if(coord[1] < 1 || coord[1] > PUZZLE_SIZE){
                toAdd = false;
            }
            if(toAdd){
                filteredArr.push(coord);
            }
        }
        return filteredArr;
    }

    /**
     * Equality is defined as being located at the same coordinate pair
     * 
     * @param that a second spot object to compare to the object
     * @returns true iff the row and column coordinate of the two spots are the same
     */
    public equalValue(that: Spot): boolean {
        if (that.getColumn() === this.column && that.getRow() === this.row) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @returns a parsable string representation of the spot ADT
     */
    public toParseableString(): string {
        return this.row + ',' + this.column;
    }

    /**
     * @returns a human readable representation of the spot ADT
     */
    public toString(): string {
        return this.row + ', ' + this.column + ', ' + this.region + ', ' + this.star;
    }

}

/**
 * An immutable Puzzle for a 10x10 game of Star Battle. As described in the project handout, it is build of 100
 * locations, which belong to a region and may or may not have a star in them. The puzzle can be in an empty, partially
 * completed, or solved game state as defined in the handout. 
 */
export class Puzzle{

    // AF(board) = the board is a 1D array of locations represented as spots of a 2D gameboard stored in row major, 1-indexed order, where the
    //             first value in the array is the top left corner of the gameboard. To get the spot at row, col, use board[(column - 1) + PUZZLE_SIZE * (row - 1);]
    // RI:
    //   length of board === PUZZLESIZE^2
    //   
    // SRE: 
    //   All instance variables are immutable, private and only star is not readonly. The only operation
    //   that returns a mutable type is not a threat since the rep is immutable. Deep copies of objects passed
    //   in the constructor are made before putting them into the rep
    //

    private readonly board: Array<Spot>;

    /**
     * Creates a new immutable puzzle object by deconstructing maps and making deep copies of spot objects
     * 
     * @param regionMap map mapping every row and column pair (in format rowxcol) to the region that is in. Every row column pair must be in the map
     * @param starMap map mapping every row and column pair (in format rowxcol) to a boolean that is true if there is a star there and false otherwise
     *                Every row column pair must be in the map (row and columns are 1 indexed)
     * @throws error if either starMap or regionMap does not every row and column pair in it or there is not exactly 100 locations listed in each
     */
    public constructor(regionMap: Map<string, number>, starMap: Map<string, boolean>) {

        //ensure exactly 100 locations exist in inputs (fail fast)
        assert([...regionMap.keys()].length === PUZZLE_SIZE**2, 'puzzle is the wrong length');
        assert([...starMap.keys()].length === PUZZLE_SIZE**2, 'puzzle is the wrong length');


        //create new board with cooresponding spot values
        const newBoard: Array<Spot> = [];
        for (let row = 1; row <= PUZZLE_SIZE; row++) {
            for (let column = 1; column <= PUZZLE_SIZE; column++) {
                const region = regionMap.get(this.getStringLocation(row, column)) ?? assert.fail('regionMap doesnt have row,column pair');
                const hasStar = starMap.get(this.getStringLocation(row, column)) ?? assert.fail('starMap doesnt have row,column pair');
                newBoard.push(new Spot(row, column, hasStar, region));
            }
        }
        this.board = newBoard;
        this.checkRep();
    }

    private checkRep(): void{
        assert(this.board.length === PUZZLE_SIZE * PUZZLE_SIZE);
    }

    /**
     * Get string version of row and column coordinate pair
     * 
     * @param row row coordinate
     * @param col column coordinate
     * @returns string representation of the row and column to be hashed
     */
    private getStringLocation(row: number, col: number): string {
        return row + ',' + col;
    }

    /**
     * Converts coordinates pair to an index for the 1D board
     * 
     * @param row coordinate to convert
     * @param column coordinate to convert
     * @returns the index of the corresponding spot for the 1D board
     * @throws error if the row or column values are outside the scope of the board
     */
    private coordsToIndex(row:number, column: number): number {
        assert(row >= 1 && row <= PUZZLE_SIZE);
        assert(column >= 1 && column <= PUZZLE_SIZE);
        return (column - 1) + PUZZLE_SIZE * (row - 1);
    }

    /**
     * Check if the given coordinate pair has a star in it
     * 
     * @param row the row coordinate to check
     * @param column the column coordinate to check
     * @returns true iff the spot has a star, otherwise false
     * @throws error if row and column are outside the range of the board
     */
    public hasStar(row: number, column: number): boolean {
        this.checkRep();
        const indexToCheck = this.coordsToIndex(row, column);
        const spotToCheck = this.board[indexToCheck]??assert.fail('index out of array');
        return spotToCheck.hasStar();
    }

    /**
     * Gets the region at the given coordinate pair
     * 
     * @param row the row coordinate to check
     * @param column the column coordinate to check
     * @returns the region at the coordinate pair
     * @throws error if row and column are outside the range of the board
     */
    public getRegion(row: number, column: number): number {
        this.checkRep();
        const indexToCheck: number = this.coordsToIndex(row, column);
        const spot: Spot = this.board[indexToCheck]??assert.fail('index out of array');
        return spot.getRegion();
    }

    /**
     * Returns a new puzzle with the star at the given coordinate pair updated to the opposite state
     * 
     * @param row the row coordinate to update
     * @param column the column coordinate to update
     * @returns a new Puzzle to reflect the updated star state at the given coordinate pair
     * @throws error if the row and column are not on the board
     */
    public toggleStar(row: number, column: number): Puzzle {
        this.checkRep();
        const regionMap: Map<string, number> = new Map();
        const starMap: Map<string, boolean> = new Map();

        //for each spot, add to the new maps
        for (const spot of this.board){
            regionMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), spot.getRegion());

            //if spot to flip the star, flip the star value
            if (spot.getRow() === row && spot.getColumn() == column){
                starMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), !spot.hasStar());
            }
            else{
                starMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), spot.hasStar()); 
            }
        }
        return new Puzzle(regionMap, starMap);
    }

    /**
     * Checks if the puzzle is solved based on the rules of Star Battle as defined in the project handout:
     *       There can be no adjacent stars (horizontally, vertically, or diagonally adjacent)
     *       There must be two stars in every region
     *       There must be two stars in every row
     *       There must be two stars in every column
     * 
     * @returns true iff the Puzzle is solved, otherwise false
     */
    public isSolved(): boolean {
        this.checkRep();
        //CHECK HAS 20 STARS AND NONE ADJACENT
        let starCount = 0;
        for (const spot of this.board){
            if (spot.hasStar()){
                starCount ++;
            }
            for (const neighborCoords of spot.getAdjacent()){
                if ((this.board[this.coordsToIndex(neighborCoords[0], neighborCoords[1])] ?? assert.fail('broken getAdjacent')).hasStar()){
                    if(spot.hasStar()){
                        return false;
                    }
                }
            }
        }

        //Check not more than 2 in same row
        for(let i = 0; i < this.board.length; i+=PUZZLE_SIZE){
            let rowCount = 0;
            for (let w = i; w < i + PUZZLE_SIZE; w++){
                if(this.board[w]?.hasStar() ?? assert.fail('same row broken' + i + ', ' + w)){
                    rowCount ++;
                }
            }
            if (rowCount !== 2){
                return false;
            }
        }


        //Check not more than 2 in same column
        for (let i = 0; i < PUZZLE_SIZE; i ++){
            let columnCount = 0;
            for (let w = i; w < this.board.length; w += PUZZLE_SIZE){
                if(this.board[w]?.hasStar() ?? assert.fail('same col broken')){
                    columnCount ++;
                }
            }
            if (columnCount !== 2){
                return false;
            }
        }

        //exactly 2 in each region of the map
        //build new star map
        const starMap: Map<number, Array<Spot>> = new Map();
        for (let i = 1; i < PUZZLE_SIZE + 1; i++){
            starMap.set(i,[]);
        }

        //enter the stars into the map
        for (const spot of this.board){
            const region = spot.getRegion();
            if (spot.hasStar()){
                (starMap.get(region) ?? assert.fail()).push(spot);
            }
        }

        //ensure that each starList is exactly 2 stars long
        for(const regionStarList of starMap.values()){
            if (regionStarList.length !== 2){
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if the puzzle is blank
     * 
     * @returns true iff there are no stars on the entire board, otherwise false
     */
    public isBlank(): boolean {
        let starCount = 0;
        for (const spot of this.board){
            if (spot.hasStar()){
                starCount ++;
            }
        }
        return starCount === 0;
    }

    /**
     * Returns a copy of the Puzzle, cleared of all stars
     * 
     * @returns a new puzzle with the same regions as current but with no stars
     */
    public clearPuzzle(): Puzzle {
        const regionMap: Map<string, number> = new Map();
        const starMap: Map<string, boolean> = new Map();
        for (const spot of this.board){
            regionMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), spot.getRegion());
            starMap.set(this.getStringLocation(spot.getRow(), spot.getColumn()), false);
        }
        return new Puzzle(regionMap, starMap);
    }

    /**
     * Returns maps needed for toString functionality
     * 
     * @returns regionMap that maps each region number to a parsable string that lists the coordinates in that map
     *          starMap that maps each region number to a parsable string that represents the stars in the region 
     */
    private getToStringMaps(): {regionMap: Map<number, string>, starMap: Map<number, string>}{
        const regionMap: Map<number, string> = new Map();
        const starMap: Map<number, string> = new Map();

        //for each spot on the board, check if it has a star and add to corresponding map
        for (const spot of this.board){
            if (!spot.hasStar()){
                regionMap.set(spot.getRegion(),(regionMap.get(spot.getRegion()) ?? '') + ' ' + spot.toParseableString());
            }
            else{
                starMap.set(spot.getRegion(),(starMap.get(spot.getRegion()) ?? '') + spot.toParseableString() + ' ');
            }
        }

        return {
            regionMap: regionMap,
            starMap: starMap
        };
    }

    /**
     * @returns a parsable string representation of the Puzzle ADT
     */
    public toParseableString(): string {
        const maps = this.getToStringMaps();

        let returnString = PUZZLE_SIZE + 'x' + PUZZLE_SIZE + '\n';
        for (let i = 1; i <= PUZZLE_SIZE; i++){
            const starList = maps.starMap.get(i);
            if (starList !== undefined){
                returnString += starList;
            }

            returnString += '|' + maps.regionMap.get(i) ??  assert.fail('does not have all the regions');
            returnString += '\n';
        }
        return returnString;
    } 

    /**
     * @returns a human readable string representation of the Puzzle ADT
     */
    public toString() : string {
        return this.toParseableString();
    }
}