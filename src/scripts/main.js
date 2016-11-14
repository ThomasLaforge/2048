window.jQuery = window.$ = require('jquery');
import { Grid } from './Grid';
import { KeycodeMap } from './Enums';

let grid = new Grid();
let score = 0;

$('body').keyup( (e) => {
    grid.action(e.keyCode);
        score += grid.action(e.keyCode);
        $('#score').html(score);
});