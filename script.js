let cols, rows;
const w = 40; // width and height of each cell
let grid = [];
let current;
const stack  = [];

function setup () {
    frameRate(45);
    createCanvas(800, 800);
    cols = floor(width/w);  //10
    rows = floor(height/w); //10

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            const cell = new Cell(i,j);
            grid.push(cell);
        }
    }
    current = grid[0];
}
function draw () {
    background(51);
    for (let  i = 0; i < grid.length; i++) {
        grid[i].show();
    }
    current.visited = true; //set the starting cell as visited
    current.highlight();  // some different coloring for the current cell
    //Step 1
    const next = current.checkNeighbours(); // the next cell to be visited (random cell from neighbours)
    if (next) {     // if there is a neighbouring cell
        next.visited = true; // then set that to visited
        //Step 2
        stack.push(current); // and push to stack
        // Step 3
        removeWalls(current, next); // then remove walls according to the conditions
        // Step 4
        current = next; // then set current node to next
    } else if (stack.length > 0) {
        current = stack.pop();

    }
}

function index (i, j) {
    if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
        return -1;
    }
    return i + j*cols;
}

function Cell(i, j) {
    this.i = i; // row
    this.j = j; // column
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbours = function () {
        const neighbours = [];
        const top = grid[index(i, j-1)];
        const right = grid[index(i+1, j)];
        const bottom = grid[index(i, j+1)];
        const left = grid[index(i-1, j)];

        // check if the neighbour exists and then check if it's visited or not if not visited push that into neighbours
        // array

        if (top && !top.visited) {
            neighbours.push(top);
        }
        if (right && !right.visited) {
            neighbours.push(right);
        }
        if (bottom && !bottom.visited) {
            neighbours.push(bottom);
        }
        if (left && !left.visited) {
            neighbours.push(left);
        }

        // if there is some neighbour/neighbours in the array then select any random neighbour from the array

        if (neighbours.length > 0) {
            const r = floor(random(0, neighbours.length));
            return neighbours[r];
        }
        else {
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

















