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
images.player = new Image();
images.player.src = "assets/images/hulk.png";
const characterActions = ["up", "right", "down"];
const numberOfCharacters = 10;
const characters = [];

class Character {
    constructor() {
        this.width = 40;
        this.height = 56;
        this.frameX = 0;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = (Math.random() * 1.5 + 3.5);
        this.action = characterActions[Math.floor(Math.random() * characterActions.length)];
        switch(this.action) {
            case "up":
                this.frameY = 3;
                this.minFrame = 0;
                this.maxFrame = 3;
                break;
            case "right":
                this.frameY = 2;
                this.minFrame = 0;
                this.maxFrame = 3;
                break;
            case "down":
                this.frameY = 0;
                this.minFrame = 0;
                this.maxFrame = 3;
                break;
        }
    }
    draw() {
        drawSprite(images.player, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = this.minFrame;
    }

    update() {
        switch(this.action) {
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
        }
       
    }
}

for (i = 0; i < numberOfCharacters; i++) {
    characters.push(new Character());
}

// function takes image source, instructions on how to crop image source (sX, sY, sW, sH), then destination coordinates for placing the image (dX, dY, dW, dH) within the canvas element
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function animate() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < characters.length; i++) {
        characters[i].draw();
        characters[i].update();
    }
}
window.onload = setInterval(animate, 1000 / 30)

