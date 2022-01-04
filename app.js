// initialize 2d canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight / 2;
canvas.width = window.innerWidth / 2;

window.addEventListener("resize", function () {
    canvas.height = window.innerHeight / 2;
    canvas.width = window.innerWidth / 2;
})



// load images
const images = {};
images.playerSprite = new Image();
images.playerSprite.src = "assets/images/cat.png";
images.monster = new Image();
images.monster.src = "assets/images/hulk.png";

const keys = [];
const monsterActions = ["up", "right", "down", "left"];
const numberOfMonsters = 10;
const monsters = [];

const player = {
    x: 200,
    y: 200,
    width: 32,
    height: 32,
    frameX: 0,
    frameY: 0,
    speed: 9,
    moving: false
}

class Monster {
    constructor() {
        this.width = 40;
        this.height = 56;
        this.frameX = 0;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
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

for (i = 0; i < numberOfMonsters; i++) {
    monsters.push(new Monster());
}

// function takes image source, instructions on how to crop image source (sX, sY, sW, sH), then destination coordinates for placing the image (dX, dY, dW, dH) within the canvas element
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

window.addEventListener("keydown", function (e) {
    keys[e.key] = true;
    player.moving = true;
})
window.addEventListener("keyup", function (e) {
    delete keys[e.key];
    player.moving = false;
})

function movePlayer() {
    if (keys["ArrowUp"] && player.y > 0) {
        player.y -= player.speed;
        player.frameY = 3;
    }
    if (keys["ArrowDown"] && player.y < canvas.height - player.height) {
        player.y += player.speed;
        player.frameY = 0;
    }
    if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
        player.x += player.speed;
        player.frameY = 2;
    }
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
        player.frameY = 1;
    }
}

function handlePlayerFrame() {
    if (player.frameX < 3 && player.moving) player.frameX++
    else player.frameX = 0;
}
console.log(monsters)
console.log(player)
function checkCollision() {
    monsters.forEach(function(monster) {
        if (player.x < monster.x + monster.width &&
            player.x + player.width > monster.x &&
            player.y < monster.y + monster.height &&
            player.y + player.height > monster.y
            ){
                console.log("collision")
            }
    })
}

let fps, fpsInterval, startTime, current, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    current = Date.now();
    elapsed = current - then;
    if (elapsed > fpsInterval) {
        then = current - (elapsed % fpsInterval)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (i = 0; i < monsters.length; i++) {
            monsters[i].draw();
            monsters[i].update();
        }
        drawSprite(images.playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
        movePlayer();
        handlePlayerFrame();
        checkCollision();
    }
}

startAnimating(15);
