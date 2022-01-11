// initialize 2d canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight / 2;
canvas.width = window.innerWidth / 2;

// HTML selectors
const startBtn = document.querySelector(".start");

// Adjust everytime window is resized to prevent warping

window.addEventListener("resize", function () {
    canvas.height = window.innerHeight / 2;
    canvas.width = window.innerWidth / 2;
})

// Movement with keys

window.addEventListener("keydown", function (e) {
    keys[e.key] = true;
    player.moving = true;
})
window.addEventListener("keyup", function (e) {
    delete keys[e.key];
    player.moving = false;
})


// **** Global variables ****

const keys = [];
const monsterActions = ["up", "right", "down", "left"];
let numberOfMonsters = 10;
const monsters = [];
let numberOfBoxes = 10;
const boxes = []; // more objects can be pushed to this array for blocking player movement
let numberOfFood = 4;
const food = [];
let health = 100;
let score = 0;

// Display score and health to DOM
let score_div = document.querySelector(".score");
let health_div = document.querySelector(".health-bar");

// load images
const images = {};
images.playerSprite = new Image();
images.playerSprite.src = "assets/images/cat.png";
images.monster = new Image();
images.monster.src = "assets/images/hulk.png";
images.box = new Image();
images.box.src = "assets/images/boxes.png";
images.rocket = new Image();
images.rocket.src = "assets/images/rocket3.png";
images.food = new Image();
images.food.src = "assets/images/strawberrycake.png"

// **** Objects ****

const player = {
    x: 200,
    y: 200,
    width: 23,
    height: 34.2,
    frameX: 0,
    frameY: 0,
    speed: 9,
    moving: false,
    collisionUp: 0,
    collisionX: 0,
    direction: "",
    mobility: {
        up: true,
        down: true,
        left: true,
        right: true
    },
    movement: true
}

class Box {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.width = 54;
        this.height = 54;
        this.frameX = 0;
        this.frameY = 0;
    }
    draw() {
        drawSprite(images.box, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

class Food {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.width = 21;
        this.height = 23;
        this.frameX = 0;
        this.frameY = 0;
    }
    draw() {
        drawSprite(images.food, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

class Monster {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.width = 40;
        this.height = 56;
        this.frameX = 0;
        this.speed = (Math.random() * 1.5 + 4.5);
        this.action = monsterActions[Math.floor(Math.random() * monsterActions.length)];
        switch (this.action) {
            case "up":
                this.frameY = 3;
                break;
            case "right":
                this.frameY = 2;
                break;
            case "down":
                this.frameY = 0;
                break;
            case "left":
                this.frameY = 1;
                break;
        }
    }
    draw() {
        drawSprite(images.monster, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
        if (this.frameX < 3) this.frameX++;
        else this.frameX = 0;
    }
    update() {
        switch (this.action) {
            case "right":
                if (this.x > canvas.width + this.width) {
                    this.x = 0 - this.width;
                    this.y = Math.random() * (canvas.height - this.height);
                } else {
                    this.x += this.speed;
                }
                break;
            case "up":
                if (this.y < (0 - this.height)) {
                    this.y = canvas.height + this.height;
                    this.x = Math.random() * canvas.width;
                } else {
                    this.y -= this.speed;
                }
                break;
            case "down":
                if (this.y > (canvas.height + this.height)) {
                    this.y = 0 - this.height;
                    this.x = Math.random() * canvas.width;
                } else {
                    this.y += this.speed;
                }
                break;
            case "left":
                if (this.x < (0 - this.width)) {
                    this.x = canvas.width + this.width;
                    this.y = Math.random() * (canvas.height - this.height);
                } else {
                    this.x -= this.speed;
                }
                break;
        }
    }
}

// Adding content to object arrays

for (i = 0; i < numberOfMonsters; i++) {
    monsters.push(new Monster());
}
for (i = 0; i < numberOfBoxes; i++) {
    boxes.push(new Box());
}
for (i = 0; i < numberOfFood; i++) {
    food.push(new Food());
}

// **** Functions ****

// function takes image source, instructions on how to crop image source (sX, sY, sW, sH), start destination coordinates for placing the image (dX, dY, dW, dH) within the canvas element

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}


// Player Movement

function movePlayer() {

    if (keys["ArrowUp"]) {
        mobilityReset();
        checkUp();
        console.log(player.mobility.up);
        if (player.mobility.up && player.y > 0) {
            player.y -= player.speed;
            player.frameY = 3;
        } else if (player.y > 0) {
            player.y = player.collisionUp;
            player.frameY = 3;
        }
    }
    if (keys["ArrowDown"]) {
        mobilityReset();
        checkDown();
        if (player.mobility.down && player.y < (canvas.height - player.height)) {
            player.y += player.speed;
            player.frameY = 0;
        } else if (player.y < (canvas.height - player.height)) {
            player.frameY = 0;
        }
    }
    if (keys["ArrowRight"]) {
        mobilityReset();
        checkRight();
        if (player.mobility.right && player.x < canvas.width - player.width) {
            player.direction = "right";
            player.x += player.speed;
            player.frameY = 2;
        } else if (player.x < canvas.width - player.width) {
            player.frameY = 2;
        }
    }
    if (keys["ArrowLeft"]) {
        mobilityReset();
        checkLeft();
        if (player.mobility.left && player.x > 0) {
            player.direction = "left";
            player.x -= player.speed;
            player.frameY = 1;
        } else if (player.x > 0) {
            player.frameY = 1;
        }
    }
}

function handlePlayerFrame() {
    if (player.frameX < 3 && player.moving) player.frameX++
    else player.frameX = 0;
}

function checkUp() {
    boxes.forEach(function (box) {

        if (
            (player.x) < (box.x) + (box.width) &&
            player.x + (player.width) > (box.x) &&
            (player.y - player.speed) < (box.y) + (box.height) &&
            (player.y - player.speed) + (player.height) > (box.y)
        ) {
            player.mobility.up = false;
            player.collisionUp = box.y + box.height;
        }
    })
}
function checkDown() {

    boxes.forEach(function (box) {
        if (
            (player.x) < (box.x) + (box.width) &&
            player.x + (player.width) > (box.x) &&
            (player.y + player.speed) < (box.y) + (box.height) &&
            (player.y + player.speed) + (player.height) > (box.y)
        ) {
            player.mobility.down = false;
        }
    })
}
function checkRight() {

    boxes.forEach(function (box) {
        if (
            (player.x + player.speed) < (box.x) + (box.width) &&
            (player.x + player.speed) + (player.width) > (box.x) &&
            (player.y) < (box.y) + (box.height) &&
            (player.y) + (player.height) > (box.y)
        ) {
            player.mobility.right = false;
        }
    })
}
function checkLeft() {

    boxes.forEach(function (box) {
        if (
            (player.x - player.speed) < (box.x) + (box.width) &&
            (player.x - player.speed) + (player.width) > (box.x) &&
            (player.y) < (box.y) + (box.height) &&
            (player.y) + (player.height) > (box.y)
        ) {
            player.mobility.left = false;
        }
    })
}
function mobilityReset () {
    player.mobility.up = true;
    player.mobility.down = true;
    player.mobility.left = true;
    player.mobility.right = true;
}


// NPC and item control

function checkMonster() {
    monsters.forEach(function (monster) {
        if (player.x > monster.x + monster.width ||
            player.x + player.width < monster.x ||
            player.y > monster.y + monster.height ||
            player.y + player.height < monster.y
        ) {

        } else {
            health -= 5;
            health_div.textContent = health;
            if (health <= 0) {
                cancelAnimationFrame(requestID);
            }
        }
    })
}
function checkFood() {
    food.forEach(function (item, index) {
        if (player.x > item.x + item.width ||
            player.x + player.width < item.x ||
            player.y > item.y + item.height ||
            player.y + player.height < item.y
        ) {

        } else {
            food.splice(index, 1);
            score++;
            health += 3;
            score_div.textContent = score;
            health_div.textContent = health;
        }
    })
}

let fps, fpsInterval, startTime, current, start, elapsed;

function startAnimating() {
    fpsInterval = 1000 / 15;
    start = Date.now();
    startTime = start;
    animate();
}

let requestID;

function animate() {
    requestID = requestAnimationFrame(animate);
    current = Date.now();
    elapsed = current - start;
    if (elapsed > fpsInterval) {
        start = current - (elapsed % fpsInterval)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (i = 0; i < monsters.length; i++) {
            monsters[i].draw();
            monsters[i].update();
        }
        for (i = 0; i < boxes.length; i++) {
            boxes[i].draw();
        }
        for (i = 0; i < food.length; i++) {
            food[i].draw();
        }
        drawSprite(images.rocket, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
        movePlayer();
        handlePlayerFrame();
        checkMonster();
        checkFood();
        
    }
}

const endBtn = document.querySelector(".end");

startBtn.addEventListener("click", startAnimating);
endBtn.addEventListener("click", function() {
    cancelAnimationFrame(requestID);
})