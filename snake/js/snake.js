// class describing part of a snake, and containing helper methods
class snakeField{
    constructor(positionX, positionY){
        this.positionX = positionX;
        this.positionY = positionY;
        this.nextPositionX = 0;
        this.nextPositionY = 0;
    }

    moveNext(){
        this.positionX = this.nextPositionX;
        this.positionY = this.nextPositionY;
    }

    positionX(){
        return this.positionX;
    }

    positionY(){
        return this.positionY;
    }

    setNextPosition(positionX, positionY){
        this.nextPositionX = positionX;
        this.nextPositionY = positionY;
    }

    id(){
        return `${this.positionX}-${this.positionY}`;
    }
}

// fields containing snake
let snakeFields = [];

// spawn snake in the middle 
let startYPosition = Math.floor(ySize/2) - 1;
let startXPosition = Math.floor(xSize/2) - 2;

for(let i = 3; i > 0; i--){
    snakeFields.push(new snakeField(startXPosition + i, startYPosition));
}

for(field of snakeFields){
    let div = document.getElementById(field.id());
    div.classList.add("snake");
}

// spawning fruit in the front of the snake on start
let fruitId = getId(startXPosition + 5, startYPosition);

document.getElementById(fruitId).classList.add("fruit");

// default direction
let moveX = 1;
let moveY = 0;
let currentDirection = "right";
let blockDirectionChange = false;

// head moves to a field not claimed by a snake, so if cannot use function for other parts
function moveHead(){
    let x = snakeFields[0].positionX + moveX;
    let y = snakeFields[0].positionY + moveY;
    snakeFields[0] = new snakeField(x, y);
}

// returns positions and id of snake head
let currentXPosition = () => snakeFields[0].positionX;
let currentYPosition = () => snakeFields[0].positionY;
let currentId = () => `${currentXPosition()}-${currentYPosition()}`;

function move(){
    // sets next position of the field
    for(let i = 1; i < snakeFields.length; i++){
        let nextField = snakeFields[i-1];
        snakeFields[i].setNextPosition(nextField.positionX, nextField.positionY);
    }

    for(let i = 1; i < snakeFields.length; i++){
        snakeFields[i].moveNext();
    }
    moveHead();
    
    // checks if snake collides with itself
    if(checkSnakeCollision()){
        stopMoving();
        return;
    }

    // removes fields containing snake
    let containers = document.getElementsByClassName("snake");
    Array.from(containers).forEach(field => field.classList.remove("snake"));

    // adds snake to new fields
    for(field of snakeFields){
        let container = document.getElementById(field.id());
        container.classList.add("snake");
    }

    // when snake is done with moving you can change direction
    blockDirectionChange = false;
    checkFruitCollision();
}

// used to stop moving when player goes out of board
function tryMove(){
    try{
        move();
    }
    catch{
        stopMoving();
    }
}

function changeDirection(e){
    // used to avoid situation when player randomly clicks buttons and snake goes into itself
    if(blockDirectionChange){
        return;
    }

    if(e.keyCode == 37 && currentDirection != "right"){
        moveX = -1;
        moveY = 0;
        currentDirection = "left";
    }
    else if(e.keyCode == 38 && currentDirection != "down"){
        moveX = 0;
        moveY = -1;
        currentDirection = "up";
    }
    else if(e.keyCode == 39 && currentDirection != "left"){
        moveX = 1;
        moveY = 0;
        currentDirection = "right";
    }
    else if(e.keyCode == 40 && currentDirection != "up"){
        moveX = 0;
        moveY = 1;
        currentDirection = "down";
    }
    blockDirectionChange = true;
}

// spawns fruit in a random field not containing snake
function spawnFruit(){
    let id = "";
    while(true){
        let x = Math.floor(Math.random() * xSize);
        let y = Math.floor(Math.random() * ySize);
        id = `${x}-${y}`;
        let field = document.getElementById(id);
        if(field.classList.contains("snake")){
            continue;
        }
        else{
            break;
        }
    }
    document.getElementById(id).classList.add("fruit");
}

function checkSnakeCollision(){
    if(document.getElementById(currentId()).classList.contains("snake")){
        return true;
    }
    return false;
}

// cheks if snake head collides with fruit and increases the counter if the condition is true
function checkFruitCollision(){
    let field = document.getElementById(currentId());
    if(field.classList.contains("snake") && field.classList.contains("fruit")){
        let lastX = snakeFields[snakeFields.length - 1].positionX;
        let lastY = snakeFields[snakeFields.length - 1].positionY;

        let newSnake = new snakeField(lastX - moveX, lastY - moveY);
        snakeFields.push(newSnake);
        field.classList.remove("fruit");

        spawnFruit();

        let counter = document.getElementById("point-counter");
        let counterContent = parseInt(counter.innerHTML);
        counterContent++;
        counter.innerHTML = counterContent;
    }
}

// ends the game and reloads window
function stopMoving(){
    clearInterval(moveInterval);
    alert("you lost");
    window.location.reload();
}

let moveInterval = setInterval(tryMove, 400);

document.onkeydown = changeDirection;