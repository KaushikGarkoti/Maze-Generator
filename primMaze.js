/*
1. Start with a grid full of walls.
2. Pick a cell, mark it as part of the maze.
   Add the walls of the cell to the wall list.
3. While there are walls in the list:
        1. Pick a random wall from the list. If only one of the two cells that the wall divides is visited, then:
            1.Make the wall a passage and mark the unvisited cell as part of the maze.
            2.Add the neighboring walls of the cell to the wall list.
        2. Remove the wall from the list.

 */

let column, row;
const w = 10;
const arwalls = [];
const grid = [];
let start;
function setup() {
    createCanvas(400, 400);
    column = floor(width/w);
    const gridList = new LinkedList();
    row = floor(height/w);
    for (let j = 0; j < row; j++) {
        for (let i = 0; i < column; i++) {
            const cell = new Cell(i, j);
            grid.push(cell);
        }
    }
    const x = floor(random(0, grid.length));
    start = grid[x];

}

function draw () {
    background(51);
    stroke(255);

    for (let i = 0 ; i < grid.length ; i++) {
        grid[i].show();
    }
    if (!start.visited) {
        start.pushWalls();
        start.visited = true;
    }

    if (arwalls.length > 0) {
        const r = floor(random(0, arwalls.length));
        const wall = arwalls[r];
        const oppositeCell = findCommonCells(wall);

        if (oppositeCell) {
            start = oppositeCell;
        }
        arwalls.splice(r,1);
    }
}

function findCommonCells (wall) {

    for (let k = 0; k < grid.length; k++) {
        if (grid[k].i === wall.i && grid[k].j === wall.j) {
            let oppositeCell;
            if (wall.type === 't') {
                oppositeCell = grid[k].checkNeighbours('b');
            } else if (wall.type === 'r') {
                oppositeCell = grid[k].checkNeighbours('l')
            } else if (wall.type === 'b') {
                oppositeCell = grid[k].checkNeighbours('t')
            } else {
                oppositeCell = grid[k].checkNeighbours('r')
            }
            if (oppositeCell) {
                removeWalls(grid[k], oppositeCell)
            }
            return oppositeCell;
        }
    }
}

function index (i, j) {
    if (i < 0 || j < 0 || i > column-1 || j > row-1) {
        return -1;
    }
    return i + j*column;
}



function Cell(i, j) {
    this.i = i; // row
    this.j = j; // column
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbours = function (cell) {
        const top = grid[index(i, j-1)];
        const right = grid[index(i+1, j)];
        const bottom = grid[index(i, j+1)];
        const left = grid[index(i-1, j)];

        if (top && !top.visited && cell === 't') {
            return top;
        }
        if (right && !right.visited && cell === 'r') {
            return right;
        }
        if (bottom && !bottom.visited && cell === 'b') {
            return bottom;
        }
        if (left && !left.visited && cell === 'l') {
            return left;
        }  else {
            return undefined;
        }
    }
    this.highlight = function () {
        const x = this.i*w;
        const y = this.j*w;
        noStroke();
        fill(0, 0, 255, 100);
        rect(x ,y, w, w);
    }
    this.show = function ()  {
        let x = this.i*w;
        let y = this.j*w;
        stroke(255);
        if (this.walls[0]) {    // top
            line(x,y,x+w,y);
        }
        if (this.walls[1]) {
            line(x+w,y,x+w,y+w);  //right
        }
        if (this.walls[2]) {
            line(x+w, y+w, x, y+w);  //bottom
        }
        if (this.walls[3]) {
            line(x, y+w, x, y);  //left
        }
        if (this.visited) {
            noStroke();
            fill(255, 0, 255 , 100)
            rect(x,y,w,w);
        }
    }
    this.pushWalls = function () {
        let x = this.i*w;
        let y = this.j*w;

        if (this.walls[0]) {    // top
            line(x,y,x+w,y);
            const wall = new Wall(this.i,this.j,x,y,x+w,y,'t');
            arwalls.push(wall);
        }
        if (this.walls[1]) {
            line(x+w,y,x+w,y+w);  //right
            const wall = new Wall(this.i,this.j,x+w,y,x+w,y+w,'r');
            arwalls.push(wall);
        }
        if (this.walls[2]) {
            line(x+w, y+w, x, y+w);  //bottom
            const wall = new Wall(this.i,this.j,x+w, y+w, x, y+w,'b');
            arwalls.push(wall);
        }
        if (this.walls[3]) {
            line(x, y+w, x, y);  //left
            const wall = new Wall(this.i,this.j,x, y+w, x, y,'l');
            arwalls.push(wall);
        }
    }
}
function Wall(i,j ,x1,y1,x2,y2,type) {
    this.i = i;
    this.j = j;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.type = type;
}

function removeWalls(a , b) {
    const x =  a.i - b.i;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    }
    else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    const y = a.j - b.j;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    }
    else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false
    }
}

