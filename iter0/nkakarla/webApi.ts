import express from 'express';

const app = express();
const PORT = 8789;

//CLIENT SIDE OF THE FUNCTIONS
/**
 * Client requests blank puzzle from the server on port 8789
 * @returns promise of a string that will have the string representation of the 
 *          empty puzzle with the regions in the format given in the starb files.
 */
app.get('/echo', (request: Request, response: Response) => {
});




//SERVER SIDE OF THE FUNCTIONS

/**
 * Adds listener to the port given to listen for calls from clients
 * @param port port number to listen to to send out values
 */
app.listen(PORT)

/**
 * Sends out the empty board to the client to the given port
 * @param port is the port number for the board to be sent to
 */
Response.send()
