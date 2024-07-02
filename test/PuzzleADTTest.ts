import assert from 'assert';
import {Spot, Puzzle} from '../src/PuzzleADT';
import {parsePuzzle} from '../src/PuzzleParser';

const EMPTY_PUZZLE = `10x10
| 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
| 2,7 3,6 3,7 3,8 4,8
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;


const SOLVED_PUZZLE = `10x10
1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
8,9 10,10 | 7,9 9,9 9,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9`;

const OTHER_SOLVED_PUZZLE = '10x10\n1,1  3,1  | 2,1\n2,3  3,5  | 1,2 1,3 1,4 1,5 2,2 2,4 2,5\n1,6  2,8  | 1,7 1,8 1,9 1,10 2,9 2,10\n6,2  5,4  | 3,2 3,3 3,4 4,1 4,2 4,3 4,4 4,5 5,1 5,2 5,3 5,5 6,1 6,3 6,4 6,5 7,1 7,2 7,5 8,1 8,5 9,1 10,1\n5,6  4,8  | 2,6 2,7 3,6 3,7 3,8 3,9 4,6 4,7 4,9 5,7 6,6 6,7 6,8 7,6\n4,10 6,10 | 3,10 5,8 5,9 5,10 6,9 7,9 7,10 8,10 9,10 10,10\n7,4  8,2  | 7,3 8,3 8,4 9,2 10,2\n9,5  10,3 | 8,6 8,7 9,3 9,4 9,6 10,4 10,5\n7,7  8,9  | 7,8 8,8 9,8\n9,7  10,9 | 9,9 10,6 10,7 10,8'


const PARTIAL_PUZZLE = `10x10
1,2 | 1,1 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  | 3,6 3,7 3,8 4,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
10,10 | 7,9 8,9 9,9 9,10
9,3 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;



describe('puzzleADT Tests', function() {
   
    //  Partitions for toString
    //      Works for blank puzzle, filled puzzle, partially filled puzzle
    //  Partitions for isSolved
    //      Works for blank puzzle, filled puzzle, partially filled puzzle
    //  Partitions for isBlank
    //      Works for blank puzzle, filled puzzle, partially filled puzzle
    //  Partitions for toggleStar
    //      Works for first star up in region, last star down in region
    //      Works on blank, filled, and partially filled puzzle
    //  Paritions for clearPuzzle
    //      Works for blank puzzle, filled puzzle, partially filled puzzle
    //  Partitions on hasStar
    //      Works for star there, star not there
    //  Partitions on getRegion
    //      Works for row and column in board
    //      works if there is star there or no star there



    it("toString for blank puzzle", function () {
        const puzzle: Puzzle = parsePuzzle(EMPTY_PUZZLE);
        // console.log(puzzle.toString());
        const toString = puzzle.toParseableString();
        const newPuzzle: Puzzle = parsePuzzle(toString);
        assert(toString === newPuzzle.toParseableString());
    });

    it("toString for solved puzzle", function () {
        const puzzle: Puzzle = parsePuzzle(SOLVED_PUZZLE);
        // console.log(puzzle.toString());
        const toString = puzzle.toParseableString();
        const newPuzzle: Puzzle = parsePuzzle(toString);
        assert.strictEqual(toString, newPuzzle.toParseableString());
    });

    it("toString for partially solved puzzle", function () {
        const puzzle: Puzzle = parsePuzzle(PARTIAL_PUZZLE);
        // console.log(puzzle.toString());
        const toString = puzzle.toParseableString();
        const newPuzzle: Puzzle = parsePuzzle(toString);
        assert.strictEqual(toString, newPuzzle.toParseableString());
    });

    it("isSolved for empty puzzle", function () {
        const puzzleString = `10x10
| 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
| 2,7 3,6 3,7 3,8 4,8
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        const puzzle: Puzzle = parsePuzzle(puzzleString);
        assert(!puzzle.isSolved());
    });
    
    it("isSolved for partial puzzle", function () {
        const puzzle: Puzzle = parsePuzzle(PARTIAL_PUZZLE);
        assert(!puzzle.isSolved());
    });

    it("isSolved for solved puzzle", function () {
        const puzzle: Puzzle = parsePuzzle(SOLVED_PUZZLE);
        assert(puzzle.isSolved());
    });

    it("isSolved for other solved puzzle", function(){
        const puzzle: Puzzle = parsePuzzle(OTHER_SOLVED_PUZZLE);
        assert(puzzle.isSolved());
    });

    it("isSolved for y adjacent stars", function () {
        const puzzleString = `10x10
| 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
3,3 3,4 | 3,2
| 2,7 3,6 3,7 3,8 4,8
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        const puzzle: Puzzle = parsePuzzle(puzzleString);
        assert(!puzzle.isSolved());
    });

    it("isSolved for x adjacent stars", function () {
        const puzzleString = `10x10
| 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
3,8  4,8 | 2,7 3,6 3,7
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        const puzzle: Puzzle = parsePuzzle(puzzleString);
        assert(!puzzle.isSolved());
    });


    it("isSolved for diagonoal stars puzzle", function () {
        const puzzleString = `10x10
| 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
| 2,7 3,6 3,7 3,8 4,8
6,2 | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
7,3 | 6,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        const puzzle: Puzzle = parsePuzzle(puzzleString);
        assert(!puzzle.isSolved());
    });

    it("isSolved for 3 in row stars puzzle", function () {
        const puzzleString = `10x10
        1,1 1,5 | 1,2 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
        1,9 | 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
| 2,7 3,6 3,7 3,8 4,8
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        const puzzle: Puzzle = parsePuzzle(puzzleString);
        assert(!puzzle.isSolved());
    });

    it("isSolved for 3 stars in column puzzle", function () {
        const puzzleString = `10x10
| 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
2,7 | 3,6 3,7 3,8 4,8
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
4,7 | 4,6 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
9,7 | 9,2 9,3 9,4 9,5 9,6 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        const puzzle: Puzzle = parsePuzzle(puzzleString);
        assert(!puzzle.isSolved());
    });

    
    it("isSolved for > 2 in region", function () {
        const puzzleString = `10x10
        1,1 2,4 2,8 | 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,5 2,6 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
| 2,7 3,6 3,7 3,8 4,8
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        const puzzle: Puzzle = parsePuzzle(puzzleString);
        assert(!puzzle.isSolved());
    });

    it("isSolved for < 2 in region", function () {
        const puzzleString = `10x10
| 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
| 2,7 3,6 3,7 3,8 4,8
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        const puzzle: Puzzle = parsePuzzle(puzzleString);
        assert(!puzzle.isSolved());
    });




    it("isBlank for empty puzzle", function () {
        const puzzle: Puzzle = parsePuzzle(EMPTY_PUZZLE);
        assert(puzzle.isBlank());
    });
    
    it("isBlank for partial puzzle", function () {
        const puzzle: Puzzle = parsePuzzle(PARTIAL_PUZZLE);
        assert(!puzzle.isBlank());
    });

    it("isBlank for solved puzzle", function () {
        const puzzle: Puzzle = parsePuzzle(SOLVED_PUZZLE);
        assert(!puzzle.isBlank());
    });


    it("clearPuzzle for solved puzzle", function () {
        const solvedPuzzle: Puzzle = parsePuzzle(SOLVED_PUZZLE);
        const emptiedPuzzle: Puzzle = solvedPuzzle.clearPuzzle();
        const emptyPuzzle: Puzzle = parsePuzzle(EMPTY_PUZZLE);
        assert.strictEqual(emptiedPuzzle.toString(), emptyPuzzle.toString());
    });

    it("clearPuzzle for partially solved puzzle", function () {
        const solvedPuzzle: Puzzle = parsePuzzle(PARTIAL_PUZZLE);
        const emptiedPuzzle: Puzzle = solvedPuzzle.clearPuzzle();
        const emptyPuzzle: Puzzle = parsePuzzle(EMPTY_PUZZLE);
        assert.strictEqual(emptiedPuzzle.toString(), emptyPuzzle.toString());
    });

    it("clearPuzzle for empty puzzle", function () {
        const solvedPuzzle: Puzzle = parsePuzzle(EMPTY_PUZZLE);
        const emptiedPuzzle: Puzzle = solvedPuzzle.clearPuzzle();
        const emptyPuzzle: Puzzle = parsePuzzle(EMPTY_PUZZLE);
        assert.strictEqual(emptiedPuzzle.toString(), emptyPuzzle.toString());
    });


    it("toggleStar first star on puzzle up", function () {
        const emptyPuzzle: Puzzle = parsePuzzle(EMPTY_PUZZLE);
        const newPuzzle = emptyPuzzle.toggleStar(1,2);

        const correctString = `10x10
        1,2 | 1,1 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
        | 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
        | 3,2 3,3 3,4
        | 2,7 3,6 3,7 3,8 4,8
        | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
        | 4,5 5,4 5,5 5,6 6,4 6,5 6,6
        | 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
        | 6,3 7,3 7,4 7,5
        | 7,9 8,9 9,9 9,10 10,10
        | 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        assert.strictEqual(newPuzzle.toString(), parsePuzzle(correctString).toString());
    });

    it("toggleStar star on mixed puzzle down", function () {
        const emptyPuzzle: Puzzle = parsePuzzle(PARTIAL_PUZZLE);
        const newPuzzle = emptyPuzzle.toggleStar(9,1);

        const correctString = `10x10
        1,2 | 1,1 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
        2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
        3,2  3,4  | 3,3
        2,7  | 3,6 3,7 3,8 4,8
        6,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
        | 4,5 5,4 5,5 5,6 6,4 6,5 6,6
        6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
        7,3  7,5  | 6,3 7,4
        10,10 | 7,9 8,9 9,9 9,10
        9,3 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        assert.strictEqual(newPuzzle.toString(), parsePuzzle(correctString).toString());
    });

    it("toggleStar star down on solved puzzle down", function () {
        const emptyPuzzle: Puzzle = parsePuzzle(SOLVED_PUZZLE);
        const newPuzzle = emptyPuzzle.toggleStar(10,10);

        const correctString = `10x10
1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
8,9 | 7,9 9,9 9,10 10,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9`;
        assert.strictEqual(newPuzzle.toString(), parsePuzzle(correctString).toString());
    });

    it("toggleStar star down on mixed puzzle last in region", function () {
        const emptyPuzzle: Puzzle = parsePuzzle(PARTIAL_PUZZLE);
        const newPuzzle = emptyPuzzle.toggleStar(9,3);

        const correctString = `10x10
        1,2 | 1,1 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
        2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
        3,2  3,4  | 3,3
        2,7  | 3,6 3,7 3,8 4,8
        6,1 9,1 | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
        | 4,5 5,4 5,5 5,6 6,4 6,5 6,6
        6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
        7,3  7,5  | 6,3 7,4
        10,10 | 7,9 8,9 9,9 9,10
        | 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        assert.strictEqual(newPuzzle.toString(), parsePuzzle(correctString).toString());
    });

    it("toggleStar star up on mixed puzzle first in region", function () {
        const emptyPuzzle: Puzzle = parsePuzzle(PARTIAL_PUZZLE);
        const newPuzzle = emptyPuzzle.toggleStar(5,4);

        const correctString = `10x10
1,2 | 1,1 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  | 3,6 3,7 3,8 4,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4 | 4,5 5,5 5,6 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
10,10 | 7,9 8,9 9,9 9,10
9,3 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        assert.strictEqual(newPuzzle.toString(), parsePuzzle(correctString).toString());
    });


    it("hasStar all types", function () {
        const puzzle: Puzzle = parsePuzzle(PARTIAL_PUZZLE);
        assert(puzzle.hasStar(1,2));
        assert(puzzle.hasStar(3,2));
        assert(puzzle.hasStar(10,10));
        assert(puzzle.hasStar(6,1));
        assert(!puzzle.hasStar(1,1));
        assert(!puzzle.hasStar(10,2));
        assert(!puzzle.hasStar(10,9));
        assert(!puzzle.hasStar(2,6));
        assert(!puzzle.hasStar(8,3));
        assert(!puzzle.hasStar(7,4));
    });


    it("getRegion all types", function () {
        const puzzle: Puzzle = parsePuzzle(PARTIAL_PUZZLE);
        assert.strictEqual(puzzle.getRegion(1,2), 1);
        assert.strictEqual(puzzle.getRegion(1,9), 2);
        assert.strictEqual(puzzle.getRegion(3,2), 3);
        assert.strictEqual(puzzle.getRegion(3,8), 4);
        assert.strictEqual(puzzle.getRegion(6,1), 5);
        assert.strictEqual(puzzle.getRegion(5,5), 6);
        assert.strictEqual(puzzle.getRegion(8,7), 7);
        assert.strictEqual(puzzle.getRegion(7,4), 8);
        assert.strictEqual(puzzle.getRegion(10,10), 9);
        assert.strictEqual(puzzle.getRegion(10,1), 10);
    });


    it("getAdjacent all types", function () {
        const spot: Spot = new Spot(1,1,true,1);
        assert.deepStrictEqual(spot.getAdjacent(), [[1,2],[2,1],[2,2]]);

        const spot2: Spot = new Spot(10,10,true,1);
        // assert.deepEqual(new Set(spot2.getAdjacent()), new Set([[9,10],[10,10],[10,9]]));

        const lastSpot: Spot = new Spot(5,5, true,1);
        // assert.deepEqual(new Set(lastSpot.getAdjacent()), new Set([[4,4],[4,5],[4,6],[5,4],[5,6],[6,4],[6,5],[6,6]]));
    });

});