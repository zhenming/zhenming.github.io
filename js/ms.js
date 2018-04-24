const NUMBER_OF_ROWS = 6;
const NUMBER_OF_COLUMNS = 6;
const NUMBER_OF_MINES = 6;

var vueApp = new Vue({
    el: '#vue-app',
    data: {
        test: "vue work!",
        cellMatrix: generateCellMatrix(NUMBER_OF_ROWS, NUMBER_OF_COLUMNS, NUMBER_OF_MINES),
    },
    methods: {
        cellClicked: function(rowIndex, colIndex, event) {
            console.log(rowIndex + ', ' + colIndex);
            var cell = this.cellMatrix[rowIndex][colIndex];
            if (cell.isMine) {
                event.target.textContent = "X"
            } else {
                event.target.textContent = cell.mineNeighbours;
            }
        }
    },
});

function generateCellMatrix(numberOfRows, numberOfColumns, numberOfMines) {
    var matrix = [];
    for (var rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        var row = [];
        for (var colIndex = 0; colIndex < numberOfColumns; colIndex++) {
            row.push({ 
                isMine: false,
                mineNeighbours: 0,
            });
        }
        matrix.push(row);
    }
    populateMines(matrix, numberOfRows, numberOfColumns, numberOfMines);
    return matrix;
}

function populateMines(matrix, numberOfRows, numberOfColumns, numberOfMines) {
    var numberOfCells = numberOfRows * numberOfColumns;
    var minesSet = generateMines(numberOfMines, numberOfCells);
    for (mineIndex of minesSet) {
        var rIndex = getRowIndex(mineIndex, numberOfColumns);
        var cIndex = getColIndex(mineIndex, numberOfColumns);
        matrix[rIndex][cIndex].isMine = true;
        updateMineNumbers(matrix, rIndex, cIndex, numberOfRows, numberOfColumns)
    }
}

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

function generateMines(numberOfMines, numberOfCells) {
    // returns a set of the cell index of the bombs
    var minesSet = new Set();
    while (minesSet.size < numberOfMines) {
        minesSet.add(getRandomInt(0, numberOfCells));
    }
    console.log(minesSet); 
    return minesSet;
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