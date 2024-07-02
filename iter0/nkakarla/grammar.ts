//Board grammar for parsing the board
//
//BOARD ::= "10x10" \n (STARS WHITESPACE* \| WHITESPACE* SPOTS \n){10}
//STARS ::= (LOCATION){2}
//SPOTS ::= LOCATION+
//LOCATION ::= NUM , NUM 
//NUM ::= [0-9]+
//WHITESPACE ::= [ \t\r]*