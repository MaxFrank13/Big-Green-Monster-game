// initialize 2d canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight / 2;
canvas.width = window.innerWidth / 2;

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
const boxes = [];

// load images
const images = {};
images.playerSprite = new Image();
images.playerSprite.src = "assets/images/cat.png";
images.monster = new Image();
images.monster.src = "assets/images/hulk.png";
images.box = new Image();
images.box.src = "assets/images/boxes.png";


// **** Objects ****

const player = {
    x: 200,
    y: 200,
    width: 32,
    height: 32,
    frameX: 0,
    frameY: 0,
    speed: 9,
    moving: false,
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

console.log(player)
console.log(monsters)
console.log(boxes)


// **** Functions ****

// function takes image source, instructions on how to crop image source (sX, sY, sW, sH), start destination coordinates for placing the image (dX, dY, dW, dH) within the canvas element
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function movePlayer() {
    checkUp();
    if (keys["ArrowUp"] && player.y > 0 && player.mobility.up) {
        player.direction = "up";
        player.y -= player.speed;
        player.frameY = 3;
        }
    checkDown();
    if (keys["ArrowDown"] && player.y < canvas.height - player.height && player.mobility.down) {
        player.direction = "down";
        player.y += player.speed;
        player.frameY = 0;
    }
    checkRight();
    if (keys["ArrowRight"] && player.x < canvas.width - player.width && player.mobility.right) {
        player.direction = "right";
        player.x += player.speed;
        player.frameY = 2;
    }
    checkLeft();
    if (keys["ArrowLeft"] && player.x > 0 && player.mobility.left && player.mobility.left) {
        player.direction = "left";  
        player.x -= player.speed;
        player.frameY = 1;
    }

}

function handlePlayerFrame() {
    if (player.frameX < 3 && player.moving) player.frameX++
    else player.frameX = 0;
}

function checkCollision() {
    monsters.forEach(function (monster) {
        if (player.x > monster.x + monster.width ||
            player.x + player.width < monster.x ||
            player.y > monster.y + monster.height ||
            player.y + player.height < monster.y
        ) {

        } else {
            console.log("collision");
        }
    })
}

function checkUp() {
    player.mobility.up = true;
    boxes.forEach(function (box) {
        if (
            (player.x) < (box.x) + (box.width - 9) &&
            player.x + (player.width) > (box.x + 9) &&
            (player.y) < (box.y) + (box.height - 9) &&
            (player.y) + (player.height) > (box.y)
        ) {
            player.mobility.up = false;
        }  
    })
}
function checkDown() {
    player.mobility.down = true;
    boxes.forEach(function (box) {
        if (
            (player.x) < (box.x) + (box.width - 9) &&
            player.x + (player.width) > (box.x + 9) &&
            (player.y + 9) < (box.y) + (box.height - 9) &&
            (player.y + 9) + (player.height) > (box.y + 9)
        ) {
            player.mobility.down = false;
        }  
    })
}
function checkRight() {
    player.mobility.right = true;
    boxes.forEach(function (box) {
        if (
            (player.x + 9) < (box.x) + (box.width - 9) &&
            (player.x + 9) + (player.width) > (box.x + 9) &&
            (player.y) < (box.y) + (box.height - 9) &&
            (player.y) + (player.height) > (box.y + 9)
        ) {
            player.mobility.right = false;
        }  
    })
}
function checkLeft() {
    player.mobility.left = true;
    boxes.forEach(function (box) {
        if (
            (player.x - 9) < (box.x) + (box.width - 9) &&
            (player.x - 9) + (player.width) > (box.x + 9) &&
            (player.y) < (box.y) + (box.height - 9) &&
            (player.y) + (player.height) > (box.y + 9)
        ) {
            player.mobility.left = false;
        }  
    })
}



// function test() {
//     boxes.forEach(function (box) {
//     if (
//         player.x < (box.x) + (box.width - 5) &&
//         player.x + player.width > (box.x + 5) &&
//         (player.y) < (box.y) + (box.height - 5) &&
//         (player.y) + player.height > (box.y + 5)
//     ) {
//         player.movement = false;
//         }
//     })
// }
// console.log(test);

// function checkObstruction(dir) {
//     boxes.forEach(function (box) {
//         switch (player.direction) {
//             case "up":
//                 if (
//                     player.x < (box.x) + (box.width - 5) &&
//                     player.x + player.width > (box.x + 5) &&
//                     (player.y) < (box.y) + (box.height - 5) &&
//                     (player.y) + player.height > (box.y + 5)
//                 ) {
//                     console.log("up-blocked");
//                     player.mobility.up = false;
//                 } else {
//                     player.mobility.down = true;
//                     player.mobility.right = true;
//                     player.mobility.left = true;
//                 }
//                 break;
//             case "down":
//                 if (
//                     player.x < (box.x) + (box.width - 5) &&
//                     player.x + player.width > (box.x + 5) &&
//                     (player.y) < (box.y) + (box.height - 5) &&
//                     (player.y) + player.height > (box.y + 5)
//                 ) {
//                     console.log("down-blocked");
//                     player.mobility.down = false;
//                 } else {
//                     player.mobility.up = true;
//                     player.mobility.right = true;
//                     player.mobility.left = true;
//                 }
//                 break;
//             case "right":
//                 if (
//                     player.x < (box.x) + (box.width - 5) &&
//                     player.x + player.width > (box.x + 5) &&
//                     (player.y) < (box.y) + (box.height - 5) &&
//                     (player.y) + player.height > (box.y + 5)
//                 ) {
//                     console.log("right-blocked");
//                     player.mobility.right = false;
//                 } else {
//                     player.mobility.up = true;
//                     player.mobility.down = true;
//                     player.mobility.left = true;
//                 }
//                 break;
//             case "left":
//                 if (
//                     player.x < (box.x) + (box.width - 5) &&
//                     player.x + player.width > (box.x + 5) &&
//                     (player.y) < (box.y) + (box.height - 5) &&
//                     (player.y) + player.height > (box.y + 5)
//                 ) {
//                     console.log("left-blocked");
//                     player.mobility.left = false;
//                 } else {
//                     player.mobility.up = true;
//                     player.mobility.down = true;
//                     player.mobility.right = true;
//                 }
//                 break;
//         }
//     })
// }

// function checkObstruction() {
//     boxes.forEach(function (box) {
//         switch (player.direction) {
//             case "up":
//                 if (
//                     player.x < (box.x) + (box.width - 5) &&
//                     player.x + player.width > (box.x + 5) &&
//                     (player.y) < (box.y) + (box.height - 5) &&
//                     (player.y) + player.height > (box.y + 5)
//                 ) {
//                     console.log("up-blocked");
//                     player.mobility.up = false;
//                 } else {
//                     player.mobility.down = true;
//                     player.mobility.right = true;
//                     player.mobility.left = true;
//                 }
//                 break;
//             case "down":
//                 if (
//                     player.x < (box.x) + (box.width - 5) &&
//                     player.x + player.width > (box.x + 5) &&
//                     (player.y) < (box.y) + (box.height - 5) &&
//                     (player.y) + player.height > (box.y + 5)
//                 ) {
//                     console.log("down-blocked");
//                     player.mobility.down = false;
//                 } else {
//                     player.mobility.up = true;
//                     player.mobility.right = true;
//                     player.mobility.left = true;
//                 }
//                 break;
//             case "right":
//                 if (
//                     player.x < (box.x) + (box.width - 5) &&
//                     player.x + player.width > (box.x + 5) &&
//                     (player.y) < (box.y) + (box.height - 5) &&
//                     (player.y) + player.height > (box.y + 5)
//                 ) {
//                     console.log("right-blocked");
//                     player.mobility.right = false;
//                 } else {
//                     player.mobility.up = true;
//                     player.mobility.down = true;
//                     player.mobility.left = true;
//                 }
//                 break;
//             case "left":
//                 if (
//                     player.x < (box.x) + (box.width - 5) &&
//                     player.x + player.width > (box.x + 5) &&
//                     (player.y) < (box.y) + (box.height - 5) &&
//                     (player.y) + player.height > (box.y + 5)
//                 ) {
//                     console.log("left-blocked");
//                     player.mobility.left = false;
//                 } else {
//                     player.mobility.up = true;
//                     player.mobility.down = true;
//                     player.mobility.right = true;
//                 }
//                 break;
//         }
//     })
// }

// function checkObstruction(dir) {
//     boxes.forEach(function (box) {
//         switch (dir) {
//             case "up":
//                 if (
//                     player.x < (box.x) + (box.width) &&
//                     player.x + player.width > (box.x) &&
//                     (player.y - player.speed) < (box.y) + (box.height) &&
//                     (player.y - player.speed) + player.height > (box.y)
//                 ) {
//                     return;
//                 }
//             break;
//         }
// })
// }


let fps, fpsInterval, startTime, current, start, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    start = Date.now();
    // startTime = start;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
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
        drawSprite(images.playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
        movePlayer();
        handlePlayerFrame();
        checkCollision();
        // 
        // checkObstruction();
    }
}

startAnimating(15);
