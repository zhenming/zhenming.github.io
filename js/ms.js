var vueApp = new Vue({
    el: '#vue-app',
    data: {
        test: "vue work!",
        cellMatrix: generateCellMatrix(),
    }
});

function generateCellMatrix() {
    return [
    [1,2,3,4],
    [4,2,8,9],
    [5,2,1,6],
    [1,6,0,3],
    ];
}