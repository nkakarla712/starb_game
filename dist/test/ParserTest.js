"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const PuzzleParser_1 = require("../src/PuzzleParser");
describe('parserTests', function () {
    //Partition on the parser
    //  Able to parse correct boards properly
    //      Solved Boards, Partially solved Boards, Empty Boards
    //  Throws errors on incorrent boards
    //      Not 10x10
    //      Missing | between stars
    //      Not 100 locations listed (<100, > 100)
    //      less than 10 regions, more than 10 regions
    it("parse correct solved board", function () {
        const solvedPuzzle = `10x10
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
        const puzzle = (0, PuzzleParser_1.parsePuzzle)(solvedPuzzle); //No need to test any functionality, just that parser does not throw an error
        //functionality is tested in PuzzleADT test
    });
    it("parse partially solved board", function () {
        const partialPuzzle = `10x10
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
        const puzzle = (0, PuzzleParser_1.parsePuzzle)(partialPuzzle); //No need to test any functionality, just that parser does not throw an error
        //functionality is tested in PuzzleADT test
    });
    it("parse empty board", function () {
        const emptyPuzzle = `10x10
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
        const puzzle = (0, PuzzleParser_1.parsePuzzle)(emptyPuzzle); //No need to test any functionality, just that parser does not throw an error
        //functionality is tested in PuzzleADT test
    });
    it("throw error on not 10x10 board", function () {
        const emptyPuzzle = `11x10
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
        assert_1.default.throws(() => (0, PuzzleParser_1.parsePuzzle)(emptyPuzzle));
    });
    it("throw error on missing | between stars", function () {
        const partialPuzzle = `10x10
1,2 | 1,1 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  | 3,6 3,7 3,8 4,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
6,8  8,7  4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
10,10 | 7,9 8,9 9,9 9,10
9,3 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        assert_1.default.throws(() => (0, PuzzleParser_1.parsePuzzle)(partialPuzzle));
    });
    it("throw error on < 100 locations", function () {
        const partialPuzzle = `10x10
1,2 | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  | 3,6 3,7 3,8 4,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
6,8  8,7  4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
10,10 | 7,9 8,9 9,9 9,10
9,3 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        assert_1.default.throws(() => (0, PuzzleParser_1.parsePuzzle)(partialPuzzle));
    });
    it("throw error on >100 locations", function () {
        const partialPuzzle = `10x10
1,2 | 1,1 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3 11,10
2,7  | 3,6 3,7 3,8 4,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
10,10 | 7,9 8,9 9,9 9,10
9,3 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        assert_1.default.throws(() => (0, PuzzleParser_1.parsePuzzle)(partialPuzzle));
    });
    it("throw error on < 10 regions", function () {
        const partialPuzzle = `10x10
1,2 | 1,1 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  | 3,6 3,7 3,8 4,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
9,3 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9`;
        assert_1.default.throws(() => (0, PuzzleParser_1.parsePuzzle)(partialPuzzle));
    });
    it("throws error on > 10 regions", function () {
        const partialPuzzle = `10x10
1,2 | 1,1 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  | 3,6 3,7 3,8 4,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4
10,10 | 7,9 8,9 9,9 9,10
9,3 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9
|`;
        assert_1.default.throws(() => (0, PuzzleParser_1.parsePuzzle)(partialPuzzle));
    });
});
//# sourceMappingURL=ParserTest.js.map