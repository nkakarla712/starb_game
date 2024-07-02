import assert from 'assert';
import fs from 'fs';
import { Puzzle } from '../iagatlin/puzzle';

/**
 * Tests for the Puzzle ADT.
 */
describe('Puzzle', function() {
    /*
     * Testing Strategy
     *
     * constructor:
     *      partition on regions: are contiguous, not contiguous, 
     *                            not contiguous by diagonal relationship // dont really think we need these tests bc 
     *                                                                       outside of spec, but not sure what else to do
     * 
     * toggleStar:
     *      partition on state of spot: star present, star absent
     * 
     * 
     * stringRep:
     *      partition on puzzle status: completed puzzle, empty puzzle, not finished puzzle
     * 
     *
     */




})