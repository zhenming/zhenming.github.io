const NUMBER_OF_ROWS = 15;
const NUMBER_OF_COLUMNS = 10;
const NUMBER_OF_MINES = 15;

const CELL_STATE_DISPLAY_MINE = -3;
const CELL_STATE_MINE = -2;
const CELL_STATE_SAFE = -1;
const CELL_STATE_BLANK = 0;
const CELL_STATE_FLAG = 1;

const GAME_STATE_INITIAL = 0;
const GAME_STATE_PLAY = 1;
const GAME_STATE_WIN = 2;
const GAME_STATE_LOSS = 3;

var vueApp = new Vue({
    el: '#vue-app',
    data: {
        gameState: GAME_STATE_INITIAL,
        gameStates: {
            initial: GAME_STATE_INITIAL,
            play: GAME_STATE_PLAY,
            win: GAME_STATE_WIN,
            loss: GAME_STATE_LOSS,
        },
        boardClasses: {
            [GAME_STATE_INITIAL]: "ms-board--end",
            [GAME_STATE_PLAY]: "",
            [GAME_STATE_WIN]: "ms-board--end",
            [GAME_STATE_LOSS]: "ms-board--end",
        },
        cellClasses: {
            [CELL_STATE_DISPLAY_MINE]: "ms-board__cell--mine-display",
            [CELL_STATE_MINE]: "ms-board__cell--mine",
            [CELL_STATE_SAFE]: "ms-board__cell--open",
            [CELL_STATE_BLANK]: '',
            [CELL_STATE_FLAG]: 'ms-board__cell--flag',
        },
        cellStates: {
            displayMine: CELL_STATE_DISPLAY_MINE,
            mine: CELL_STATE_MINE,
            safe: CELL_STATE_SAFE,
            blank: CELL_STATE_BLANK,
            flag: CELL_STATE_FLAG,
        },
        cellMatrix: [],
        numberOfColumns: NUMBER_OF_COLUMNS,
        numberOfRows: NUMBER_OF_ROWS,
        numberOfMines: NUMBER_OF_MINES,
        initialCellState: CELL_STATE_BLANK,
        numberOfMinesRemaining: 0,
        minesSet: [],
    },
    methods: {
        startGame: function() {
            this.gameState = this.gameStates.play;
            this.generateCellMatrix();
            this.numberOfMinesRemaining = this.numberOfMines;
        },
        endGame: function() {
            this.gameState = this.gameStates.initial;
        },
        winGame: function() {
            this.gameState = this.gameStates.win;
            this.displayMines();
        },
        loseGame: function() {
            this.gameState = this.gameStates.loss;
            this.displayMines();
        },
        generateCellMatrix: function() {
            var matrix = [];
            for (var rowIndex = 0; rowIndex < this.numberOfRows; rowIndex++) {
                var row = [];
                for (var colIndex = 0; colIndex < this.numberOfColumns; colIndex++) {
                    row.push({
                        isMine: false,
                        mineNeighbours: 0,
                        state: this.initialCellState,
                    });
                }
                matrix.push(row);
            }
            this.cellMatrix = matrix;
            this.populateMines();
        },
        populateMines: function() {
            this.generateMines();
            for (mineIndex of this.minesSet) {
                this.cellMatrix[mineIndex[0]][mineIndex[1]].isMine = true;
                updateMineNumbers(this.cellMatrix, mineIndex[0], mineIndex[1], this.numberOfRows, this.numberOfColumns)
            }
        },
        generateMines: function() {
            // returns a set of the cell index of the bombs
            var minesIndexSet = new Set();
            var numberOfCells = this.numberOfRows * this.numberOfColumns;
            while (minesIndexSet.size < this.numberOfMines) {
                minesIndexSet.add(getRandomInt(0, numberOfCells));
            }
            this.minesSet = new Set();
            for (let mineIndex of minesIndexSet) {
                this.minesSet.add([
                    getRowIndex(mineIndex, this.numberOfColumns),
                    getColIndex(mineIndex, this.numberOfColumns),
                ]);
            }
            console.log(this.minesSet); 
        },
        displayMines: function() {
            // show all mines that are not opened
            for (mineIndex of this.minesSet) {
                var cell = this.cellMatrix[mineIndex[0]][mineIndex[1]];
                if (cell.state === this.cellStates.blank) {
                    cell.state = this.cellStates.displayMine;
                }
            }
        },
        cellLeftClicked: function(rowIndex, colIndex) {
            var cell = this.cellMatrix[rowIndex][colIndex];
            // left click, we only process cells with state blank
            if (cell.state === this.cellStates.blank) {
                if (cell.isMine) {
                    cell.state = this.cellStates.mine;
                    this.loseGame();
                } else {
                    cell.state = this.cellStates.safe;
                    if (cell.mineNeighbours === 0) {
                        // cell has no mine neighbours, open all neighbours
                        this.openAllNeighbours(rowIndex, colIndex)
                    }
                    if (this.gameWon()) {
                        this.winGame();
                    }
                }
            }
        },
        cellRightClicked: function(rowIndex, colIndex) {
            var cell = this.cellMatrix[rowIndex][colIndex];
            // right click, we only process cells with state blank or state flag
            if (cell.state === this.cellStates.blank) {
                cell.state = this.cellStates.flag;
                this.numberOfMinesRemaining -= 1;
            } else if (cell.state === this.cellStates.flag) {
                cell.state = this.cellStates.blank;
                this.numberOfMinesRemaining += 1;
            }
        },
        openAllNeighbours: function(rowIndex, colIndex) {
            var neighboursSet = getNeighbours(rowIndex, colIndex, this.numberOfRows, this.numberOfColumns);
            for (neighbourIndex of neighboursSet) {
                var rIndex = getRowIndex(neighbourIndex, this.numberOfColumns);
                var cIndex = getColIndex(neighbourIndex, this.numberOfColumns);
                this.cellLeftClicked(rIndex, cIndex); 
            }
        },
        gameWon: function() {
            // return true if all cells that are not mine are in the safe state
            // i.e. all non mine cell has been opened
            for (var rowIndex = 0; rowIndex < this.numberOfRows; rowIndex++) {
                for (var colIndex = 0; colIndex < this.numberOfColumns; colIndex++) {
                    var cell = this.cellMatrix[rowIndex][colIndex];
                    if (!cell.isMine && cell.state !== this.cellStates.safe) {
                        // there exist non mine cell that is still not in safe state
                        return false;
                    }
                }
            }
            // all non mine cells are in safe state
            return true;
        }
    },
});

function updateMineNumbers(matrix, mineRowIndex, mineColIndex, numberOfRows, numberOfColumns) {
    var neighboursSet = getNeighbours(mineRowIndex, mineColIndex, numberOfRows, numberOfColumns);
    for (neighbourIndex of neighboursSet) {
        var rIndex = getRowIndex(neighbourIndex, numberOfColumns);
        var cIndex = getColIndex(neighbourIndex, numberOfColumns);
        matrix[rIndex][cIndex].mineNeighbours += 1;
    }
}

function getNeighbours(rowIndex, colIndex, numberOfRows, numberOfColumns) {
    // returns a set of the cell index of the neighbours
    var neighbourSet = new Set();
    var allNeighbours = [
        [rowIndex-1, colIndex-1], [rowIndex-1, colIndex], [rowIndex-1, colIndex+1],
        [rowIndex, colIndex-1], [rowIndex, colIndex+1],
        [rowIndex+1, colIndex-1], [rowIndex+1, colIndex], [rowIndex+1, colIndex+1],
    ];
    for (var neighbour of allNeighbours) {
        var rIndex = neighbour[0];
        var cIndex = neighbour[1];
        if (rIndex >= 0 && rIndex < numberOfRows && cIndex >= 0 && cIndex < numberOfColumns) {
            // cell is a valid neighbour, add to neighbour set
            neighbourSet.add(getCellIndex(rIndex, cIndex, numberOfColumns));
        }
    }
    return neighbourSet;
}

function getCellIndex(rowIndex, colIndex, numberOfColumns) {
    // returns the cell index based on row and column index
    return rowIndex * numberOfColumns + colIndex;
}

function getRowIndex(cellIndex, numberOfColumns) {
    // returns the row index based on cell index
    return Math.floor(cellIndex/numberOfColumns);
}

function getColIndex(cellIndex, numberOfColumns) {
    // returns the column index based on cell index
    return cellIndex % numberOfColumns;
}

function getRandomInt(min, max) {
    // The minimum is inclusive and the maximum is exclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
}