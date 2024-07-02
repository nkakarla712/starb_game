import assert from 'assert';
import type { Canvas, CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from 'canvas';

describe('client', function() {
    //Given the nature of the project, we did the client testing mannually. In order to run the below partitions, run
    //Npm run server
    //Npm run watchify-client
    //Open star-client.html in your browser to play the game

    //Partitions on the client
    //  Note: since we test all the internal functionality of the ADT and server seperately, the main functionality is below
    //  Ensure that the board is loaded properly and the regions are correctly colored
    //  Ensure that the click functionality works in order to toggle stars
    //      Boxes on the vertical edges, horizontal edges, middle of the board
    //      This ensures that the click mapping and passing into the ADT is correct
    //  Ensure that with a solved board, the client outputs "puzzle is sovled" in the textbox
    //  Ensure that if you click outside of the grid, nothing happens
});