/*
1. Create a list of all walls, and create a set for each cell,
   each containing just that one cell.
2. For each wall, in some random order:
    1. If the cells divided by this wall belong to
       distinct sets:
        1. Remove the current wall.
        2. Join the sets of the formerly divided cells.
*/
const w = 20;
const grid = [];
const arWalls = [];
let setOfCells;
let row,col;
function setup() {
    createCanvas(400, 400);
     row = width/w;
     col = height/w;
    let n = 0;
    for (let i = 0; i < row; i++) {
        for (let j = 0 ; j < col; j++) {
            n++
            const cell = new Cell(i,j,n);
            grid.push(cell);
        }
    }
    setOfCells = new Array(grid.length);
    for (let i = 0; i < setOfCells.length; i++) {
        setOfCells[i] = -1;
    }
}
function draw() {
    background(51);
    stroke(255);
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    const r = floor(random(0, arWalls.length));
    const wall = arWalls[r];
    const commonCells = findCommonCells(wall);
    if (commonCells !== undefined) {
        if (find(commonCells[0].cellNumber) !== find(commonCells[1].cellNumber)) {
            removeWalls(commonCells[0],commonCells[1]);
            arWalls.splice(r,1);
            union(commonCells[0].cellNumber,commonCells[1].cellNumber);
        }
    }
}

function find(u) {
    let x = u;
    while(setOfCells[u] > 0) {
        x = setOfCells[u];
    }
    return x;
}

function union(u, v) {
    if (setOfCells[u] < setOfCells[v]) {
        setOfCells[u] = setOfCells[u] + setOfCells[v];
        setOfCells[v] = u;
    } else {
        setOfCells[v] = setOfCells[u] + setOfCells[v];
        setOfCells[u] = v
    }
}

function index (i, j) {
    if (i < 0 || j < 0 || i > row-1 || j > col-1) {
        return -1;
    }
    return i + j*col;
}


function Cell(i,j,n) {
    this.i = i;
    this.j = j;
    this.cellNumber = n;
    this.visited = false;
    this.walls = [true, true, true, true];

    this.show = function() {
        const x = this.i*w;
        const y = this.j*w;
       if (this.walls[0]) { //top
           line(x, y,x+w, y);
           const wall = new Wall(this.i, this.j, x, y, x+w, y,'t');
           arWalls.push(wall);
       }
       if (this.walls[1]) { //right
           line(x+w, y, x+w, y+w);
           const wall = new Wall(this.i, this.j, x+w, y, x+w, y+w,'r');
           arWalls.push(wall);
       }
       if (this.walls[2]) {
           line(x+w, y+w, x, y+w); //bottom
           const wall = new Wall(this.i, this.j, x+w, y+w, x, y+w,'b');
           arWalls.push(wall);
       }
       if (this.walls[3]) {
           line(x, y+w, x,y); //left
           const wall = new Wall(this.i, this.j, x, y+w, x, y,'l');
           arWalls.push(wall);
       }
       if (this.visited) {
           noStroke();
           fill(255, 0, 255, 100);
           rect(x,y,w,w);
       }
    }

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
                return [oppositeCell,grid[k]];
            }
            else {
                return undefined;
            }

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

function removeWalls(a, b) {
    // const x = b.j - a.j;
    const x = 1;
    const y = b.i - a.i;
    console.log(x,y);
    // if x is 1 then that means b is right to a and if x is -1 then it means b is left to a
    // if y is 1 then that means b is bottom to a and if y is -1 then it means b is on top of a
    if ( x === 1 ) {
        b.walls[3] = false;
        a.walls[1] = false;
    }
    if ( x === -1) {
        b.walls[1] = false;
        a.walls[3] = false;
    }
    if ( y === 1 ) {
        b.walls[0] = false;
        a.walls[2] = false;
    }
    if ( y === -1 ) {
        b.walls[2] = false;
        a.walls[0] = false;
    }
}
