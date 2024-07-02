"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This test file runs in Node.js, see the `npm test` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.
// See the *Testing* section of the project handout for more advice.
const assert_1 = __importDefault(require("assert"));
const StarbServer_1 = require("../src/StarbServer");
const node_fetch_1 = __importDefault(require("node-fetch"));
const PORT = 8789;
const PUZZLE_1 = "kd-1-1-1";
const PUZZLE_2 = "kd-6-31-6";
const EMPTY_PUZZLE_1 = `10x10
| 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
| 1,9 1,10 2,9 2,10 3,9 3,10 4,9 4,10 5,9 5,10 6,9 6,10 7,10 8,10
| 3,2 3,3 3,4
| 2,7 3,6 3,7 3,8 4,8
| 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,1 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6 9,1
| 4,5 5,4 5,5 5,6 6,4 6,5 6,6
| 4,6 4,7 5,7 5,8 6,7 6,8 7,6 7,7 7,8 8,7 8,8
| 6,3 7,3 7,4 7,5
| 7,9 8,9 9,9 9,10 10,10
| 9,2 9,3 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,6 10,7 10,8 10,9\n`;
const EMPTY_PUZZLE_2 = `10x10
| 1,1 2,1 3,1
| 1,2 1,3 1,4 1,5 2,2 2,3 2,4 2,5 3,5
| 1,6 1,7 1,8 1,9 1,10 2,8 2,9 2,10
| 3,2 3,3 3,4 4,1 4,2 4,3 4,4 4,5 5,1 5,2 5,3 5,4 5,5 6,1 6,2 6,3 6,4 6,5 7,1 7,2 7,5 8,1 8,5 9,1 10,1
| 2,6 2,7 3,6 3,7 3,8 3,9 4,6 4,7 4,8 4,9 5,6 5,7 6,6 6,7 6,8 7,6
| 3,10 4,10 5,8 5,9 5,10 6,9 6,10 7,9 7,10 8,10 9,10 10,10
| 7,3 7,4 8,2 8,3 8,4 9,2 10,2
| 8,6 8,7 9,3 9,4 9,5 9,6 10,3 10,4 10,5
| 7,7 7,8 8,8 8,9 9,8
| 9,7 9,9 10,6 10,7 10,8 10,9\n`;
describe('server', function () {
    //Partitions on Server
    //  Ensure that server.start() is working
    //  Ensure that server.get is working and returning the right puzzle based on the input
    //      Test puzzle 1 and puzzle 2 and ensure returning a blank version of the puzzles
    //  Ensure that server.stop() is working by closing the server
    it('covers requesting puzzle 1 from the server', async function () {
        const server = new StarbServer_1.WebServer(PORT);
        await server.start();
        const url = `http://localhost:8789/puzzle?puzzleName=${PUZZLE_1}`;
        // in this test, we will just assert correctness of the server's output
        const response = await (0, node_fetch_1.default)(url);
        assert_1.default.strictEqual(await response.text(), EMPTY_PUZZLE_1);
        server.stop();
    });
    it('covers requesting puzzle 2 from the server', async function () {
        const server = new StarbServer_1.WebServer(PORT);
        await server.start();
        const url = `http://localhost:8789/puzzle?puzzleName=${PUZZLE_2}`;
        // in this test, we will just assert correctness of the server's output
        const response = await (0, node_fetch_1.default)(url);
        assert_1.default.strictEqual(await response.text(), EMPTY_PUZZLE_2);
        server.stop();
    });
});
//# sourceMappingURL=StarbServerTest.js.map