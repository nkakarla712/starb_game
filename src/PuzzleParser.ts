
import { Puzzle, Spot} from './PuzzleADT';
import { Parser, ParseTree, compile, visualizeAsUrl } from 'parserlib';
import assert from 'assert';

/**
 * Parser for Star Battle puzzles.
 */
const grammar = `
    BOARD ::= COMMENT* '10x10' [\\n] ROW{10} ;
    COMMENT ::= WHITESPACE* '#' [^\\n]+ [\\n]* ;
    ROW ::= (WHITESPACE* STARS* '|' SPOTS+ [\\n]*) ;
    STARS ::= WHITESPACE* LOCATION WHITESPACE ;
    SPOTS ::= WHITESPACE LOCATION ;
    LOCATION ::= NUM ',' NUM ;
    NUM ::= [0-9]+ ;
    WHITESPACE ::= [ \\t\\r]+ ;
`;
    
enum PuzzleGrammar {
    Board, Row, Stars, Spots, Location, Num, Whitespace, Comment
}

// compile the grammar into a parser
const parser: Parser<PuzzleGrammar> = compile(grammar, PuzzleGrammar, PuzzleGrammar.Board);

/**
 * Parse a string into an puzzle.
 * 
 * @param puzzleString string representation of a star battle puzzle
 * @returns puzzle object that the puzzleString represents
 * @throws ParseError if the string doesn't match the puzzle grammar or if the inputted puzzle has != 100 locations, != 10 regions, or is not 10x10
 */
export function parsePuzzle(puzzleString: string): Puzzle {
    const parseTree: ParseTree<PuzzleGrammar> = parser.parse(puzzleString); // create parse tree

    // display the parse tree in various ways, for debugging only if we need to change the grammar in the future
    // console.log("parse tree:\n" + parseTree);
    // console.log(visualizeAsUrl(parseTree, PuzzleGrammar));

    const puzzle: Puzzle = makePuzzle(parseTree); // convert parse tree to a Puzzle object
    return puzzle;
}

/**
 * Convert a parse tree into an Puzzle:
 * 
 * @param parseTree ParseTree containing stars and spots in their respective regions according to the grammar for star battle puzzles
 * @returns Puzzle object corresponding to the parseTree
 * @throws ParseError if the string doesn't match the puzzle grammar or if the inputted puzzle has != 100 locations, != 10 regions, or is not 10x10
 */
function makePuzzle(parseTree: ParseTree<PuzzleGrammar>): Puzzle {
    const rows: Array<ParseTree<PuzzleGrammar>> = parseTree.childrenByName(PuzzleGrammar.Row);

    const regionMap: Map<string, number> = new Map(); // initialize structures for Puzzle constructor 
    const starMap: Map<string, boolean> = new Map();
    

    let region = 1;
    for (const row of rows) { // a row contains the spots and stars of a region
        const stars: Array<ParseTree<PuzzleGrammar>> = row.childrenByName(PuzzleGrammar.Stars);
        const spots: Array<ParseTree<PuzzleGrammar>> = row.childrenByName(PuzzleGrammar.Spots);

        //iterate through stars and add them to the star and region maps
        for (const star of stars) {
            const spotLocation: Array<string> = star.text.split(',').map((num:string) => num.trim()); // split star into [row, column] in order to trim whitespace
            starMap.set(spotLocation[0] + ',' + spotLocation[1], true);
            regionMap.set(spotLocation[0] + ',' + spotLocation[1], region);    
        }
        
        //iterate through the empty spots and add them to the star and region maps
        for (const spot of spots) {
            const spotLocation: Array<string> = spot.text.split(',').map((num:string) => num.trim());
            starMap.set(spotLocation[0] + ',' + spotLocation[1], false);
            regionMap.set(spotLocation[0] + ',' + spotLocation[1], region);
        }        
        region++; // next row in loop is the next region, so increment
    }


    return new Puzzle(regionMap, starMap);
}

/**
 * Main function. Parses and then reprints an example expression. Mainly used for debugging in this file.
 */
function main(): void {
    const solvedInput = `# Star Battle Puzzles by KrazyDad, Volume 1, Book 1, Number 1
# from https://krazydad.com/starbattle/
# (also shown in the project handout)
10x10
1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
8,9 10,10 | 7,9 9,9 9,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9
`;
const blankInput = `10x10
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

    console.log(parsePuzzle(solvedInput));
    // console.log(parsePuzzle(blankInput));
}

if (require.main === module) {
    main();
}