import express, {Request, Response} from 'express';
import HttpStatus from 'http-status-codes';

const app = express();
const PORT = 8789; // accept HTTP requests on this port, identified by filename

app.listen(PORT, () => {
    console.log(`now listening at port ${PORT}`);
});

// url and specs are up to me,
// sends blank puzzles

/**
 * preconditions: request must be a id number related to a new game board
 * 
 * postconditions: the server will respond with data allowing the client to create
 *                 a new game board
 * 
 */

// get /puzzles/?puzzle=<string>
// response is the blank game board that is denoted by the id that was used to request it
app.get('/puzzles/', (request: Request, response, Response) => {

});