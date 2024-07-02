// Grammar single grammar for “blank” and “solved” puzzles (no testing or implementation)

// blank puzzle
// BOARD_FILE ::= (REGION NEWLINE){100}
// REGION ::= [0-9]
// NEWLINE ::= "\r"? "\n"

// solved puzzle
// BOARD_FILE ::= (SPOT NEWLINE){100}
// SPOT ::= STATUS REGION
// STATUS ::= "star" | "open" | "unusable"
// REGION ::= [0-9]{1}
// NEWLINE ::= "\r"? "\n"