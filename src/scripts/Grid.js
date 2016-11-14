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

    action(keyCode){
        let scoreToAdd = 0;
        if(this.oneBoxIsFree() || this.fusionIsPossible()){
            let factorI, factorJ;
            if(keyCode == KeycodeMap.UP){
                factorI = 1;
                factorJ = 1;

                // Fusion
                for(let i=0; i < this.nbRow; i = i + 1 * factorI){
                    for(let j=0; j < this.nbRow; j = j + 1 * factorJ){
                        if(this.grid[i][j] != null){
                            let nextRowWithSameValue = i + 1;
                            
                            while(nextRowWithSameValue < this.nbRow && this.grid[nextRowWithSameValue][j] == null){
                                nextRowWithSameValue++;
                            }

                            if(nextRowWithSameValue < this.nbRow && this.grid[nextRowWithSameValue][j] == this.grid[i][j]){
                                this.grid[i][j] *= 2;
                                scoreToAdd = this.grid[i][j];
                                this.grid[nextRowWithSameValue][j] = null;
                            }
                        }
                    }
                }

                // Move All
                for(let i=0; i < this.nbRow; i = i + 1 * factorI){
                    for(let j=0; j < this.nbRow; j = j + 1 * factorJ){
                        if(this.grid[i][j] != null){
                            let rowUp = i - 1;
                            while(rowUp >= 0 && this.grid[rowUp][j] == null){
                                rowUp--;
                            }

                            if(rowUp+1 >= 0 && this.grid[rowUp+1][j] == null){
                                this.grid[rowUp+1][j] = this.grid[i][j];
                                this.grid[i][j] = null;
                            }
                        }
                    }
                }
                
            }
            else if(keyCode == KeycodeMap.DOWN){
                factorI = -1;
                factorJ = 1;
                            // Fusion
                for(let i = this.nbRow - 1; i >= 0; i--){
                    for(let j=0; j < this.nbRow; j++){
                        if(this.grid[i][j] != null){
                            let nextRowWithSameValue = i - 1;
                            
                            while(nextRowWithSameValue >= 0 && this.grid[nextRowWithSameValue][j] == null){
                                nextRowWithSameValue--;
                            }

                            if(nextRowWithSameValue >= 0 && this.grid[nextRowWithSameValue][j] == this.grid[i][j]){
                                this.grid[i][j] *= 2;
                                scoreToAdd = this.grid[i][j];                                
                                this.grid[nextRowWithSameValue][j] = null;
                            }
                        }
                    }
                }

                // Move All
                for(let i = this.nbRow - 1; i >= 0; i--){
                    for(let j=0; j < this.nbRow; j = j + 1 * factorJ){
                        if(this.grid[i][j] != null){
                            let rowUp = i + 1;
                            while(rowUp < this.nbRow && this.grid[rowUp][j] == null){
                                rowUp++;
                            }

                            if(rowUp - 1 < this.nbRow && this.grid[rowUp-1][j] == null){
                                this.grid[rowUp - 1][j] = this.grid[i][j];
                                this.grid[i][j] = null;
                            }
                        }
                    }
                }            
            }
            else if(keyCode == KeycodeMap.LEFT){
                // Fusion
                for(let j=0; j < this.nbCol; j++){
                    for(let i=0; i < this.nbRow; i++){
                        if(this.grid[i][j] != null){
                            let nextColWithSameValue = j + 1;
                            
                            while(nextColWithSameValue < this.nbRow && this.grid[i][nextColWithSameValue] == null){
                                nextColWithSameValue++;
                            }

                            if(nextColWithSameValue < this.nbRow && this.grid[i][nextColWithSameValue] == this.grid[i][j]){
                                this.grid[i][j] *= 2;
                                scoreToAdd = this.grid[i][j];                            
                                this.grid[i][nextColWithSameValue] = null;
                            }
                        }
                    }
                }

                // Move All
                for(let j=0; j < this.nbCol; j++){
                    for(let i=0; i < this.nbRow; i++){
                        if(this.grid[i][j] != null){
                            let colUp = j - 1;
                            while(colUp >= 0 && this.grid[i][colUp] == null){
                                colUp--;
                            }

                            if(colUp + 1 >= 0 && this.grid[i][colUp + 1] == null){
                                this.grid[i][colUp + 1] = this.grid[i][j];
                                this.grid[i][j] = null;
                            }
                        }
                    }
                }
            }
            else if(keyCode == KeycodeMap.RIGHT){
                for(let j = this.nbCol - 1; j >= 0; j--){
                    for(let i=0; i < this.nbRow; i++){
                        if(this.grid[i][j] != null){
                            let nextColWithSameValue = j - 1;
                            
                            while(nextColWithSameValue >= 0 && this.grid[i][nextColWithSameValue] == null){
                                nextColWithSameValue--;
                            }

                            if(nextColWithSameValue >= 0 && this.grid[i][nextColWithSameValue] == this.grid[i][j]){
                                this.grid[i][j] *= 2;
                                scoreToAdd = this.grid[i][j];                                
                                this.grid[i][nextColWithSameValue] = null;
                            }
                        }
                    }
                }

                // Move All
                for(let j = this.nbCol - 1; j >= 0; j--){
                    for(let i=0; i < this.nbRow; i++){
                        if(this.grid[i][j] != null){
                            let colUp = j + 1;
                            while(colUp < this.nbRow && this.grid[i][colUp] == null){
                                colUp++;
                            }

                            if(colUp - 1 < this.nbCol && this.grid[i][colUp-1] == null){
                                this.grid[i][colUp-1] = this.grid[i][j];
                                this.grid[i][j] = null;
                            }
                        }
                    }
                }           
            }
            else{
                throw new Error('Action : Not valid action');
            }

            this.addRandomBox();            
            this.debug();
            this.draw();
        }
        else{
            console.log('gameOver');
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

    fusionIsPossible(){
        let res = false;
        // Fusion
        for(let i=0; i < this.nbRow; i++){
            for(let j=0; j < this.nbRow; j++){
                if(this.grid[i][j] != null){
                    let nextRowWithSameValue = i + 1;
                    
                    while(nextRowWithSameValue < this.nbRow && this.grid[nextRowWithSameValue][j] == null){
                        nextRowWithSameValue++;
                    }

                    if(nextRowWithSameValue < this.nbRow && this.grid[nextRowWithSameValue][j] == this.grid[i][j]){
                        res = true;
                    }
                }
            }
        }

        return res;
    }

    draw(){
        $('#grid').empty();
        for(let i = 0; i < this.nbRow; i++){
            $('#grid').append(`
                <div class="grid-row"></div>
            `);
            for(let j = 0; j < this.nbCol; j++){
                $('.grid-row').last().append(`
                    <div id="row-${i}-col-${j}" class="box ${this.grid[i][j] ? 'box-' + this.grid[i][j] : ''}">${this.grid[i][j] ? this.grid[i][j] : ''}</div>
                `);
            }
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
