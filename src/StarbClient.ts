/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This code is loaded into starb-client.html, see the `npm compile` and
//   `npm watchify-client` scripts.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.

import assert from 'assert';
import fetch from 'node-fetch';
import { parsePuzzle } from './PuzzleParser';
import { Puzzle } from './PuzzleADT';
import { Canvas, Image, createCanvas, loadImage } from 'canvas';

const PUZZLE_SIZE = 10;
const BOX_SIZE = 42;

// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS: Array<string> = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];

// semitransparent versions of those colors
const BACKGROUNDS = COLORS.map((color) => color + '60');

/**
 * Puzzle to request and play.
 * Project instructions: this constant is a [for now] requirement in the project spec.
 */
const PUZZLE = "kd-6-31-6";

/**
 * Mutable Client ADT, as described in the Star Battle project handout. 
 */
export class Client {

    // AF(puzzle) = a client interacting with a Star Board Puzzle represented by 'puzzle'
    // RI = true
    // Safety from Rep Exposure: 
    //   puzzle is private and the objects stored at puzzle are immutable, all return types of operations 
    //   are immutable or void

    private puzzle: Puzzle | undefined;

    public constructor() {
        this.puzzle = undefined;
    }

    private checkRep(): void {
        assert(true);
    }

    /**
     * Requests a empty puzzle from the server and sets the puzzle instance variable to the puzzle received
     * 
     * @param file puzzle file to load a puzzle from
     */
    public async requestPuzzle(file:string = PUZZLE) : Promise<void> {
        const serverResponse = await fetch(`http://localhost:8789/puzzle?puzzleName=${file}`); // send request to server
        const puzzleString = await serverResponse.text(); // empty puzzleString has been sent
        this.puzzle = parsePuzzle(puzzleString); // parse string into Puzzle and set to instance variable
    }

    /**
     * Sets the puzzle attribute of the client to a new puzzle with star toggled
     * 
     * @param row the row coordinate at which to add/remove the new star. Must be 1-10.
     * @param column the column coordinate at which to add/remove the new star. Must be 1-10.
     */
    private toggleStar(row: number, column: number): void {
        assert(this.puzzle, "no puzzle has been loaded yet");
        this.puzzle = this.puzzle.toggleStar(row, column);
        this.checkRep();
    }

    /**
     * Get the region of the current coordinate
     * 
     * @param row the row coordinate. Must be 1-10.
     * @param column the column coordinate. Must be 1-10.
     * @returns the region of the coordinate.
     */
    private getRegion(row: number, column: number): number {
        this.checkRep();
        assert(this.puzzle, "no puzzle has been loaded yet");
        return this.puzzle.getRegion(row, column);
    }

    /**
     * Checks if the specific row and col of the puzzle has a star
     * 
     * @param row the row coordinate to check. Must be 1-10.
     * @param column the column coordinate to check. Must be 1-10.
     * @returns true iff there is a star present at the coordinate
     */
    private hasStar(row:number, column: number): boolean {
        this.checkRep();
        assert(this.puzzle, "no puzzle has been loaded yet");
        return this.puzzle.hasStar(row, column);
    }

    /**
     * Evaluates if the current puzzle in the client is solved or not
     * 
     * @returns true if the current star battle puzzle used by the client is solved as defined in the rules of 
     *          star battle in the project handout, otherwise false
     */
    public isPuzzleSolved(): boolean {
        this.checkRep();
        assert(this.puzzle, "no puzzle has been loaded yet");
        return this.puzzle.isSolved();
    }

    /**
     * Draws the puzzle onto the canvas
     * 
     * @param canvas the canvas on which to draw the puzzle
     * @param clearFirst whether the canvas should first be cleared
     */
    public drawPuzzle(canvas: HTMLCanvasElement, clearFirst=false): void {
        const context = canvas.getContext('2d');
        assert(context, 'unable to get canvas drawing context');

        if (clearFirst) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

        context.save(); // save original context settings before we translate and change colors

        for (let column = 0; column < PUZZLE_SIZE; column++) {
            for (let row = 0; row < PUZZLE_SIZE; row++) {
                const region = this.getRegion(row + 1, column + 1);

                // draw the outer outline box centered on the origin (which is now (x,y))
                context.strokeStyle = BACKGROUNDS[region - 1] ?? assert.fail('failed');
                context.lineWidth = 4;
                context.strokeRect(BOX_SIZE*column, BOX_SIZE*row, BOX_SIZE, BOX_SIZE);

                context.fillStyle = BACKGROUNDS[region - 1] ?? assert.fail('failed');
                context.fillRect(BOX_SIZE*column, BOX_SIZE*row, BOX_SIZE, BOX_SIZE);

                context.restore(); // reset the origin and styles back to defaults
            }
        }

        const numSides = 5; // parameters for the stars to be drawn on the puzzle
        const outerRad = 12;
        const innerRad = 6;

        for (let column = 0; column < PUZZLE_SIZE; column++) {
            for (let row = 0; row < PUZZLE_SIZE; row++) {
                const star: boolean = this.hasStar(row + 1, column + 1);
                if (star) {
                    this.drawStar(context, BOX_SIZE*column + BOX_SIZE/2, BOX_SIZE*row + BOX_SIZE/2, numSides, outerRad, innerRad);
                }
            }
        }
        this.checkRep();
    }

    /**
     * Draws a star on the puzzle
     * 
     * @param context on which to draw the star
     * @param cx the center x coord
     * @param cy the center y coord
     * @param spikes the number of spikes on the star
     * @param outerRadius the outer radius of the star
     * @param innerRadius the inner radius of the star
     * 
     * function code modified from this stack overflow post:
     * https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
     */
    private drawStar(context: CanvasRenderingContext2D, cx: number, cy: number, spikes:number, outerRadius: number, innerRadius:number): void {
        const THREE = 3;
        let rot=Math.PI/2*THREE;
        let x=cx;
        let y=cy;
        const step=Math.PI/spikes;

        if (context === null) {
            throw new Error('context is null');
        } else {
            context.beginPath();
            context.moveTo(cx,cy-outerRadius);
            for(let i=0;i<spikes;i++){
                x=cx+Math.cos(rot)*outerRadius;
                y=cy+Math.sin(rot)*outerRadius;
                context.lineTo(x,y);
                rot+=step;

                x=cx+Math.cos(rot)*innerRadius;
                y=cy+Math.sin(rot)*innerRadius;
                context.lineTo(x,y);
                rot+=step;
            }
            context.lineTo(cx,cy-outerRadius);
            context.closePath();
            context.lineWidth=5;
            context.strokeStyle='white';
            context.stroke();
            context.fillStyle='black';
            context.fill();
        }  
        this.checkRep();
    }

    /**
     * Handles a click by toggling a star at the clicked area of the canvas
     * 
     * @param canvas the canvas on which to draw
     * @param x the x coordinate of the click
     * @param y the y coordinate of the click
     */
    public handleClick(canvas: HTMLCanvasElement, x: number, y: number): void {
        const row = this.discretizeClick(y);
        const column = this.discretizeClick(x);
        this.toggleStar(row, column);
        this.drawPuzzle(canvas, true);
        this.checkRep();
    }

    /**
     * Converts a coordinate to a discretized area on an axis
     * 
     * @param coordinate to convert to a discrete area on the canvas
     * @returns discrete area at which the coordinate corresponds
     */
    private discretizeClick(coordinate: number): number {
        this.checkRep();
        if (coordinate > 0) {
            return Math.ceil(coordinate/BOX_SIZE);
        } else {
            return 1;
        }
    }
}

/**
 * Print a message by appending it to an HTML element.
 * 
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea: HTMLElement, message: string): void {
    outputArea.innerText += message + '\n';  // append the message to the output area
    outputArea.scrollTop = outputArea.scrollHeight;  // scroll the output area so that what we just printed is visible
}

/**
 * Runs the webpage where Star Battle is player
 */
async function main(): Promise<void> {
    const client: Client = new Client();
    await client.requestPuzzle();

    // output area for printing
    const outputArea: HTMLElement = document.getElementById('outputArea') ?? assert.fail('missing output area');
    // canvas for drawing
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement ?? assert.fail('missing drawing canvas');
    client.drawPuzzle(canvas);

    // when the user clicks on the drawing canvas...
    canvas.addEventListener('click', (event: MouseEvent) => {
        client.handleClick(canvas, event.offsetX, event.offsetY);

        if (client.isPuzzleSolved()) {
            printOutput(outputArea, `You have solved the puzzle!`);
        }
    });

    // add initial instructions to the output area
    printOutput(outputArea, `Click the board to begin playing!`);
}

main().catch(error => {throw new Error('cannot run main correctly');});