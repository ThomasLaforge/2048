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

        this.gameOver = false;
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
            this.addRandomTile();
        }
        
        // console.log('grid initialized', this.grid);
        this.debug();
        this.draw();
    }

    moveUp(){
        let scoreToAdd = 0;
        let hasMovedOrFused = false;
        // Fusion
        for(let i=0; i < this.nbRow; i++){
            for(let j=0; j < this.nbRow; j++){
                if(this.grid[i][j] != null){
                    let nextRowWithSameValue = i + 1;
                    
                    while(nextRowWithSameValue < this.nbRow && this.grid[nextRowWithSameValue][j] == null){
                        nextRowWithSameValue++;
                    }

                    if(nextRowWithSameValue < this.nbRow && this.grid[nextRowWithSameValue][j] == this.grid[i][j]){
                        this.grid[i][j] *= 2;
                        scoreToAdd = this.grid[i][j];
                        this.grid[nextRowWithSameValue][j] = null;
                        if(!hasMovedOrFused) hasMovedOrFused = true;
                    }
                }
            }
        }

        // Move All
        for(let i=0; i < this.nbRow; i++){
            for(let j=0; j < this.nbRow; j++){
                if(this.grid[i][j] != null){
                    let rowUp = i - 1;
                    while(rowUp >= 0 && this.grid[rowUp][j] == null){
                        rowUp--;
                    }

                    if(rowUp+1 >= 0 && this.grid[rowUp+1][j] == null){
                        this.grid[rowUp+1][j] = this.grid[i][j];
                        this.grid[i][j] = null;
                        if(!hasMovedOrFused) hasMovedOrFused = true;                        
                    }
                }
            }
        }

        return { scoreToAdd : scoreToAdd, hasMovedOrFused : hasMovedOrFused };
    }

    rotate(){
        let transformedArray = [];
		for ( var i = 0; i < this.grid[0].length; i++ ){
            transformedArray[i] = [];
            
            // fill the row with everything in the appropriate column of the source array
            var transformedArrayColumn = -1;
            for ( var j = this.grid.length - 1; j > -1; j-- ){
                transformedArrayColumn++;
                transformedArray[i][transformedArrayColumn] = this.grid[j][i]
            }
        }
        this.grid = transformedArray;
    }

    action(keyCode){
        let resOfMove;
        if(this.oneTileIsFree() || this.fusionIsPossible() || this.moveIsPossible()){
            if(keyCode == KeycodeMap.UP){
                resOfMove = this.moveUp();
            }
            else if(keyCode == KeycodeMap.DOWN){
                this.rotate();
                this.rotate();
                resOfMove = this.moveUp();
                this.rotate();
                this.rotate();          
            }
            else if(keyCode == KeycodeMap.LEFT){
                this.rotate();
                resOfMove = this.moveUp();
                this.rotate();
                this.rotate();
                this.rotate();
            }
            else if(keyCode == KeycodeMap.RIGHT){
                this.rotate();
                this.rotate();
                this.rotate();
                resOfMove = this.moveUp();
                this.rotate();       
            }
            else{
                throw new Error('Action : Not valid action');
            }

            if(resOfMove.hasMovedOrFused){
                this.addRandomTile();
                this.debug();
                this.draw();
            }
        }
        else{
            this.gameOver = true;
        }

        return resOfMove ? resOfMove.scoreToAdd : 0;
    }

    addRandomTile(){
        let rand = Math.random() * 100;
        let sumOfOccurenceFrequencies = 0;
        let j = 0;
        while(j < this.frequenciesOfOccurence.length && rand > sumOfOccurenceFrequencies){
            sumOfOccurenceFrequencies += this.frequenciesOfOccurence[j];
            j++;
        }
        let valueToAdd = this.initValues[j-1];

        // Add value to random box
        let randomFreeTile = this.getRandomTileFree();
        if(randomFreeTile != null){
            this.grid[randomFreeTile.row][randomFreeTile.col] = valueToAdd;
        }
        // $('#row-' + row + '-col-' + col).html(valueToAdd).css('display', 'none').show( "slow" );
    }

    getRandomTileFree(){
        let allTileFree = this.getAllTileFree();
        let res = null;
        
        if(allTileFree.length > 0){
            let randomTileFreeIndex = Math.floor( Math.random() * allTileFree.length);
            res = allTileFree[randomTileFreeIndex];
        }

        return res;        
    }

    getAllTileFree(){
        let arrTileFree = [];
        for(let i=0; i < this.nbRow; i++){
            for(let j=0; j < this.nbRow; j++){
                if(this.grid[i][j] == null){
                    arrTileFree.push({row:i, col:j});
                }
            }
        }
        return arrTileFree;
    }

    oneTileIsFree(){
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

        for(let i = this.nbRow - 1; i >= 0; i--){
            for(let j=0; j < this.nbRow; j++){
                if(this.grid[i][j] != null){
                    let nextRowWithSameValue = i - 1;
                    
                    while(nextRowWithSameValue >= 0 && this.grid[nextRowWithSameValue][j] == null){
                        nextRowWithSameValue--;
                    }

                    if(nextRowWithSameValue >= 0 && this.grid[nextRowWithSameValue][j] == this.grid[i][j]){
                        res = true;
                    }
                }
            }
        }

        for(let j=0; j < this.nbCol; j++){
            for(let i=0; i < this.nbRow; i++){
                if(this.grid[i][j] != null){
                    let nextColWithSameValue = j + 1;
                    
                    while(nextColWithSameValue < this.nbRow && this.grid[i][nextColWithSameValue] == null){
                        nextColWithSameValue++;
                    }

                    if(nextColWithSameValue < this.nbRow && this.grid[i][nextColWithSameValue] == this.grid[i][j]){
                        res = true;
                    }
                }
            }
        }

        for(let j = this.nbCol - 1; j >= 0; j--){
            for(let i=0; i < this.nbRow; i++){
                if(this.grid[i][j] != null){
                    let nextColWithSameValue = j - 1;
                    
                    while(nextColWithSameValue >= 0 && this.grid[i][nextColWithSameValue] == null){
                        nextColWithSameValue--;
                    }

                    if(nextColWithSameValue >= 0 && this.grid[i][nextColWithSameValue] == this.grid[i][j]){
                        res = true;
                    }
                }
            }
        }

        return res;
    }

    canMoveUp(){
        let canMoveUp = false;
        let i = 0;
        
        while(i < this.nbRow && !canMoveUp){
            let j = 0;
            while(j < this.nbCol && !canMoveUp){
                if(this.grid[i][j] != null){
                    let nextRowWithSameValue = i + 1;
                    
                    while(nextRowWithSameValue < this.nbRow && this.grid[nextRowWithSameValue][j] == null){
                        nextRowWithSameValue++;
                    }

                    if(nextRowWithSameValue < this.nbRow && this.grid[nextRowWithSameValue][j] == this.grid[i][j]){
                        canMoveUp = true;
                    }
                }
                j++;
            }

            i++;
        }

        return canMoveUp;
    }

    moveIsPossible(){
        let moveIsPossible = false;
        let rotationToDo = 4;
        let cpt = 0;

        while(cpt < rotationToDo && !moveIsPossible){
            this.rotate();
            moveIsPossible = this.canMoveUp();
            cpt++;
        }

        return cpt != rotationToDo;
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

    get gameOver(){
        return this._gameOver;
    }
    set gameOver( newgameOver ){
        this._gameOver = newgameOver;
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
