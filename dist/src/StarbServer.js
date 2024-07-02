"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebServer = void 0;
// This file runs in Node.js, see the `npm server` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const PuzzleParser_1 = require("./PuzzleParser");
const PORT = 8789;
/**
 * HTTP web game server.
 */
class WebServer {
    /**
     * Make a new web game server using board that listens for connections on port.
     *
     * @param requestedPort server port number
     */
    constructor(requestedPort) {
        this.requestedPort = requestedPort;
        this.app = (0, express_1.default)();
        this.app.use((request, response, next) => {
            // allow requests from web pages hosted anywhere
            response.set('Access-Control-Allow-Origin', '*');
            next();
        });
        this.app.get('/puzzle', (request, response) => {
            const query = request.query['puzzleName'];
            if (typeof query === 'string') {
                const puzzleName = "./puzzles/" + query + ".starb";
                fs_1.default.promises.readFile(puzzleName, 'utf8').then((file) => {
                    const puzzle = (0, PuzzleParser_1.parsePuzzle)(file);
                    const clearedPuzzle = puzzle.clearPuzzle(); // we only want to send an empty puzzle (no stars) to client
                    const parsedPuzzle = clearedPuzzle.toParseableString();
                    response
                        .status(http_status_codes_1.default.OK)
                        .type('text')
                        .send(parsedPuzzle);
                }).catch(error => { throw new Error('could not read file from computer'); });
            }
            else {
                throw new Error('query is not a string');
            }
        });
        this.checkRep();
    }
    checkRep() {
        (0, assert_1.default)(true);
    }
    /**
     * Start this server.
     *
     * @returns (a promise that) resolves when the server is listening
     */
    async start() {
        this.checkRep();
        return new Promise(resolve => {
            this.server = this.app.listen(this.requestedPort, () => {
                console.log('server now listening at', this.requestedPort);
                resolve();
            });
        });
    }
    stop() {
        if (this.server != undefined) {
            this.server.close();
        }
    }
}
exports.WebServer = WebServer;
/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 */
async function main() {
    const server = new WebServer(PORT);
    await server.start();
}
if (require.main === module) {
    void main();
}
//# sourceMappingURL=StarbServer.js.map