import { KeycodeMap } from './Enums';

class Grid {
    constructor(nbRow = 4, nbCol = 4, nbBoxToFill = 2, initValues = [2, 4], frequenciesOfOccurence = [90, 10]){
        // controls
        let sumOfOccurenceFrequencies = 0;
        frequenciesOfOccurence.forEach( (frequency) => {
            sumOfOccurenceFrequencies += frequency;
        });
        if(sumOfOccurenceFrequencies != 100){
            throw new Error('Config: sumOfOccurenceFrequencies not 100%');
        }

        if(nbBoxToFill > nbRow * nbCol){
            throw new Error('Config: Number of box to fill is superior of number of box');
        }


        this.nbRow = nbRow;
        this.nbCol = nbCol;
        this.nbBoxToFill = nbBoxToFill;
        this.initValues = initValues;
        this.frequenciesOfOccurence = frequenciesOfOccurence;
        this.initGrid();
    }

    initGrid(){
        // Init an array of row by col of null elt
        let newGrid = [];
        for(let i = 0; i < this.nbRow; i++){
            let newRow = [];
            for(let j = 0; j < this.nbCol; j++){
                newRow.push(null);
            }
            newGrid.push(newRow);
        }
        this.grid = newGrid;

        // Add $nbInitValue random elt : 2 (90%) or 4 (10%)
        let valuesToAdd = [];
        for(let i = 0; i < this.nbBoxToFill; i++){
            this.addRandomBox();
        }
        
        // console.log('grid initialized', this.grid);
        this.debug();
        this.draw();
    }

            }
        }

        return scoreToAdd;
    }

    addRandomBox(){
        let rand = Math.random() * 100;
        let sumOfOccurenceFrequencies = 0;
        let j = 0;
        while(j < this.frequenciesOfOccurence.length && rand > sumOfOccurenceFrequencies){
            sumOfOccurenceFrequencies += this.frequenciesOfOccurence[j];
            j++;
        }
        let valueToAdd = this.initValues[j-1];

        // Add value to random box
        let row = Math.round( Math.random() * ( this.nbRow - 1 ));
        let col = Math.round( Math.random() * ( this.nbCol - 1 ));

        while(this.grid[row][col] != null){
            row = Math.round( Math.random() * ( this.nbRow - 1));
            col = Math.round( Math.random() * ( this.nbCol - 1 ));
        }
        this.grid[row][col] = valueToAdd;
        // $('#row-' + row + '-col-' + col).html(valueToAdd).css('display', 'none').show( "slow" );
    }

    oneBoxIsFree(){
        for(let i=0; i < this.nbRow; i++){
            for(let j=0; j < this.nbRow; j++){
                if(this.grid[i][j] == null) return true;
            }
        }
        return false;
    }


        // Save the grid
        this.grid = newGrid;
        console.log('grid initialized', this.grid);
        this.debug();
    }

    action(keyCode){
        switch (keyCode) {
            case KeycodeMap.UP:
                                
                break;
            
            case KeycodeMap.DOWN:

                break;
            
            case KeycodeMap.LEFT:

                break;
            
            case KeycodeMap.RIGHT:

                break;

            default:
                console.log('Action : Not valid action');
                break;
            
        }
    }

    debug(){
        let log = '';

        // First line
        for(let i=0;i<this.nbCol;i++){
            log += ' ---';
        }
        log += "\n";

        this.grid.forEach( row => {
            log += "|";

            for(let i=0;i<this.nbCol;i++){
                let val = row[i] ? row[i] : ' ';
                log += ' ' + val +  ' |';
            }

            log += "\n|";

            for(let i=0;i<this.nbCol;i++){
                log += '---|';
            }
            log += "\n";
        });

        console.log(log);
    }

    /**
     * Getters / Setters
     */
    get grid(){
        return this._grid;
    }
    set grid( newGrid ){
        this._grid = newGrid;
    }

    get nbRow(){
        return this._nbRow;
    }
    set nbRow( newNbRow ){
        this._nbRow = newNbRow;
    }

    get nbCol(){
        return this._nbCol;
    }
    set nbCol( newNbCol ){
        this._nbCol = newNbCol;
    }

    get nbBoxToFill(){
        return this._nbBoxToFill;
    }
    set nbBoxToFill( newNbBoxToFill ){
        this._nbBoxToFill = newNbBoxToFill;
    }

    get initValues(){
        return this._initValues;
    }
    set initValues( newInitValues ){
        this._initValues = newInitValues;
    }

    get frequenciesOfOccurence(){
        return this._frequenciesOfOccurence;
    }
    set frequenciesOfOccurence( newFrequenciesOfOccurence ){
        this._frequenciesOfOccurence = newFrequenciesOfOccurence;
    }

}

export { Grid }
