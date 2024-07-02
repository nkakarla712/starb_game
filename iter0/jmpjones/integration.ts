//Integration t.s. + tests: plan for manual testing of entire client/server system (partitions and outline of manual test cases)
// function(s) or type(s) to drive client interaction with server and user, handling user input

// Integration Testing Strategy
//   partition on user action: adding a star, removing a star
//      if adding: spot is placeable, spot is not placeable
//   partition on is game finished: yes, one move away, more than one move away
//   partition on number of stars: 0, 0->n, n, n_2n, 2n
//   partition on board to load of example boards: kd-1-1-1, kd-6-31-6

// Manual Testing Outline:
//   test that board shows up correctly under various partitions
//   test that star can be added/removed given varying densities of the board
//   test that star can upload blank boards: test on all example boards