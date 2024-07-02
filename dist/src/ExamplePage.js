"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This code is loaded into example-page.html, see the `npm watchify-example` script.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.
const assert_1 = __importDefault(require("assert"));
const BOX_SIZE = 16;
// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS = [
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
const DIMENSIONS = 10;
const WIDTH = 100;
const HEIGHT = 100;
/**
 * Draw a black square filled with a random color.
 *
 * @param canvas canvas to draw on
 * @param x x position of center of box
 * @param y y position of center of box
 */
function drawBox(canvas, x, y) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(x, y);
    // draw the outer outline box centered on the origin (which is now (x,y))
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.strokeRect(-BOX_SIZE / 2, -BOX_SIZE / 2, BOX_SIZE, BOX_SIZE);
    // fill with a random semitransparent color
    context.fillStyle = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)] ?? assert_1.default.fail();
    context.fillRect(-BOX_SIZE / 2, -BOX_SIZE / 2, BOX_SIZE, BOX_SIZE);
    // reset the origin and styles back to defaults
    context.restore();
}
/**
 * Print a message by appending it to an HTML element.
 *
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea, message) {
    // append the message to the output area
    outputArea.innerText += message + '\n';
    // scroll the output area so that what we just printed is visible
    outputArea.scrollTop = outputArea.scrollHeight;
}
/**
 * Set up the example page.
 */
function main() {
    // output area for printing
    const outputArea = document.getElementById('outputArea') ?? assert_1.default.fail('missing output area');
    // canvas for drawing
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail('missing drawing canvas');
    // when the user clicks on the drawing canvas...
    canvas.addEventListener('click', (event) => {
        drawBox(canvas, event.offsetX, event.offsetY);
    });
    // add initial instructions to the output area
    printOutput(outputArea, `Click in the canvas above to draw a box centered at that point`);
}
// /**
//      * @returns a Canvas drawing of the client's puzzle, as depicted in the Star Battle handout
//      */
// public puzzleDrawing(): Canvas {
//     return this.canvas;
//     // context.drawImage(image, 0, 0);
//     // const pngData = canvas.toBuffer('image/png');
//     // fs.writeFileSync(filename, pngData);
//     // this.puzzle // talk to jake about this
// }
// assert(this.canvas);
//         const context = this.canvas.getContext('2d');
//         if (newNumStars > oldNumStars) { // check to see if the toggle star was to add or remove star
//             context.beginPath();
//             context.lineWidth = 1;
//             context.strokeStyle = "black";
//             const squareCenterX = column * WIDTH/DIMENSIONS + WIDTH/DIMENSIONS/2;
//             const squareCenterY = row * HEIGHT/DIMENSIONS + HEIGHT/DIMENSIONS/2;
//             context.moveTo(squareCenterX, squareCenterY);
//             context.lineTo(squareCenterX + THREE, squareCenterY + THREE); // draw 4 prong "star", its more like a plus sign
//             context.stroke();
//             context.moveTo(squareCenterX, squareCenterY);
//             context.lineTo(squareCenterX - THREE, squareCenterY + THREE);
//             context.stroke();
//             context.moveTo(squareCenterX, squareCenterY);
//             context.lineTo(squareCenterX + THREE, squareCenterY - THREE);
//             context.stroke();
//             context.moveTo(squareCenterX, squareCenterY);
//             context.lineTo(squareCenterX - THREE, squareCenterY - THREE);
//             context.stroke();
//             context.moveTo(squareCenterX, squareCenterY);
//             context.closePath();
//             context.fill(); // this is a plus sign right no filling, need to make a better star once we can see what it looks like on webpage
//         } else {
//             context.clearRect(row * WIDTH/DIMENSIONS + 1, column * HEIGHT/DIMENSIONS + 1, WIDTH-2, HEIGHT-2);
//         }
//         if (this.puzzle.isSolved()) {
//             // game is won
//         } else {
//             // nothing
//         }
// const context = this.canvas.getContext('2d');
//         context.clearRect(0, 0, WIDTH, HEIGHT);
// for (const region of this.puzzle.getRegions().keys()) { // setting up colored boxes for each region
//     context.fillStyle = BACKGROUNDS[region-1] ?? assert.fail('failure');
//     for (const location of this.puzzle.getRegions().get(region) ?? assert.fail('failure')) {
//         context.strokeRect(location.getX() * WIDTH/DIMENSIONS, location.getY() * HEIGHT/DIMENSIONS, WIDTH/DIMENSIONS, HEIGHT/DIMENSIONS); // may need to change depending on Puzzle ADT
//     }
// }
main();
//# sourceMappingURL=ExamplePage.js.map