window.jQuery = window.$ = require('jquery');
import { Grid } from './Grid';
import { KeycodeMap } from './Enums';

let grid = new Grid();
let score = 0;

$('body').keyup( (e) => {
    if(e.keyCode != KeycodeMap.DOWN && e.keyCode != KeycodeMap.UP && e.keyCode != KeycodeMap.LEFT && e.keyCode != KeycodeMap.RIGHT ){
        console.log('not a key with action');
    }
    else{
        score += grid.action(e.keyCode);
        $('#score').html(score);

        if(grid.gameOver){
            console.log('game is over');
        }
    }
});