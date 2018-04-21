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
            event.target.textContent = this.cellMatrix[rowIndex][colIndex];
        }
    },
});

function generateCellMatrix(numberOfRows, numberOfColumns, numberOfMines) {
    var numberOfCells = numberOfRows * numberOfColumns;
    var minesSet = generateMines(numberOfMines, numberOfCells);
    var matrix = [];
    for (var rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        var row = [];
        for (var colIndex = 0; colIndex < numberOfColumns; colIndex++) {
            var cellIndex = getCellIndex(rowIndex, colIndex, numberOfColumns);
            if (minesSet.has(cellIndex)) {
                console.log(cellIndex);
                console.log(rowIndex + ', ' + colIndex);
                getNeighbours(rowIndex, colIndex, numberOfRows, numberOfColumns);
                row.push('X');
            } else {
                row.push('O');
            }
        }
        matrix.push(row);
    }
    return matrix;
}

function getCellIndex(rowIndex, colIndex, numberOfColumns) {
    // returns the cell index based on row and column index
    return rowIndex * numberOfColumns + colIndex;
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
    console.log(neighbourSet);
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

function getRandomInt(min, max) {
    // The minimum is inclusive and the maximum is exclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
}