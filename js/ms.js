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
        cellClicked: function(x, y, event) {
            console.log(x + ', ' + y);
            event.target.textContent = this.cellMatrix[x][y];
        }
    },
});

function generateCellMatrix(numberOfRows, numberOfColumns, numberOfMines) {
    var numberOfCells = numberOfRows * numberOfColumns;
    var minesSet = getMines(numberOfMines, numberOfCells);
    var matrix = [];
    for (var i = 0; i < numberOfRows; i++) {
        var row = [];
        for (var j = 0; j < numberOfColumns; j++) {
            var cellIndex = i * numberOfColumns + j
            if (minesSet.has(cellIndex)) {
                row.push('X');
            } else {
                row.push('O');
            }
        }
        matrix.push(row);
    }
    return matrix;
}

function getMines(numberOfMines, numberOfCells) {
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