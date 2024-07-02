/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This file runs in Node.js, see the `npm server` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.

import assert from 'assert';
import fs from 'fs';
import { Server } from 'http';
import express, { Request, Response, Application } from 'express';
import HttpStatus from 'http-status-codes';

import { parsePuzzle } from './PuzzleParser';
import { Puzzle } from './PuzzleADT';

const PORT = 8789;

/**
 * HTTP web game server.
 */
export class WebServer {

    // AF(app, server, requestedPort) = a webserver that once started, runs a server that uses 'app' to
    //                                  listen for requests on requestedPort,
    //                                  
    // Representation Invariant = true
    //
    // Safety from rep exposure:
    //   instance variables are private and 'app' is also readonly, only void promises are returned from the class so safe
    //   from rep exposure. Additionally, only input to constructor is immutable.

    private readonly app: Application;
    private server: Server|undefined;

    
    /**
     * Make a new web game server using board that listens for connections on port.
     * 
     * @param requestedPort server port number
     */
    public constructor(
        private readonly requestedPort: number
    ) {
        this.app = express();
        this.app.use((request, response, next) => {
            // allow requests from web pages hosted anywhere
            response.set('Access-Control-Allow-Origin', '*');
            next();
        });

        this.app.get('/puzzle', (request: Request, response: Response) => {
            const query = request.query['puzzleName'];
    
            if (typeof query === 'string') {
                const puzzleName: string = "./puzzles/" + query + ".starb";

                fs.promises.readFile(puzzleName, 'utf8').then((file) => {
                    const puzzle: Puzzle = parsePuzzle(file);
                    const clearedPuzzle: Puzzle = puzzle.clearPuzzle(); // we only want to send an empty puzzle (no stars) to client
                    const parsedPuzzle: string = clearedPuzzle.toParseableString();
                    response
                        .status(HttpStatus.OK)
                        .type('text')
                        .send(parsedPuzzle);
                }).catch(error => {throw new Error('could not read file from computer');});
            } else {
                throw new Error('query is not a string');
            }
        });
        this.checkRep();
    }

    private checkRep(): void {
        assert(true);
    }

    /**
     * Start this server.
     * 
     * @returns (a promise that) resolves when the server is listening
     */
    public async start(): Promise<void> {
        this.checkRep();
        return new Promise(resolve => {
            this.server = this.app.listen(this.requestedPort, () => {
                console.log('server now listening at', this.requestedPort);
                resolve();
            });
        });
    }

    public stop(): void {
        if (this.server != undefined){
            this.server.close();
        }
    }

}

/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 */
async function main(): Promise<void> {
    const server = new WebServer(PORT);
    await server.start();
}

if (require.main === module) {
    void main();
}