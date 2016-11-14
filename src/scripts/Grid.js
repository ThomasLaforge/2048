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
        this.grid = this.initGrid();
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

        // Add $nbInitValue random elt : 2 (90%) or 4 (10%)
        let valuesToAdd = [];
        for(let i = 0; i < this.nbBoxToFill; i++){
            let rand = Math.random() * 100;

            let sumOfOccurenceFrequencies = 0;
            let j = 0;
            while(j < this.frequenciesOfOccurence.length && rand > sumOfOccurenceFrequencies){
                sumOfOccurenceFrequencies += this.frequenciesOfOccurence[j];
                j++;
            }
            valuesToAdd.push(this.initValues[j-1]);
        }

        // Add values to random box
        valuesToAdd.forEach( (val) => {
            let row = Math.round( Math.random() * ( this.nbRow - 1 ));
            let col = Math.round( Math.random() * ( this.nbCol - 1 ));

            while(newGrid[row][col] != null){
                row = Math.round( Math.random() * ( this.nbRow - 1));
                col = Math.round( Math.random() * ( this.nbCol - 1 ));
            }
            newGrid[row][col] = val;
        });


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


    moveElt(row, col, rowEnd, colEnd){
        // controls
        if(rowStart < 0 || rowEnd < 0 || colStart < 0 || colEnd < 0 || rowStart > this.nbRow || rowEnd > this.nbRow || colStart > this.nbCol || colEnd > this.nbCol ){
            console.log(rowStart, colStart, rowEnd, colEnd);
            throw new Error('Action: moveElt -> one element doesn\'t have valid coordonate');
        }

        // remove current box

        // create new box
        this.addBox(newBox);
    }

    // Level
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
