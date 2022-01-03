// initialize 2d canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// load images
const images = {};
images.player = new Image();
images.player.src = "assets/images/hulk.png";
console.log(images.player);

// sprite placement determined by width/height of sprite sheet
const playerWidth = "40";
const playerHeight = "56";
let playerFrameX = 3;
let playerFrameY = 2;
let playerX = 0;
let playerY = 0;
const playerSpeed = 6;

// function takes image source, instructions on how to crop image source (sX, sY, sW, sH), then destination coordinates for placing the image (dX, dY, dW, dH) within the canvas element
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function animate(){
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw image onto canvas
    drawSprite(images.player, playerWidth * playerFrameX, playerHeight * playerFrameY, playerWidth, playerHeight, playerX, playerY, playerWidth, playerHeight);
}

window.onload = setInterval(animate, 1000/30);