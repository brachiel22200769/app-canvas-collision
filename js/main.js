document.body.style.backgroundColor = "white";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.height = "100vh";
document.body.style.margin = "0";

document.body.innerHTML = "<h1 style='font-size: 32px; font-weight: bold; color:rgb(0, 0, 0); text-shadow: 2px 2px 4px rgb(104, 18, 148); margin-bottom: 10px;'>DETECCIÓN DE COLISIONES CON SONIDO *BEEP*</h1>" + document.body.innerHTML;

theCanvas = document.getElementById("canvas");
let ctx = theCanvas.getContext("2d");

theCanvas.style.border = "8px solidrgb(197, 97, 255)";
theCanvas.style.borderRadius = "30px";
theCanvas.style.boxShadow = "0 0 25px rgba(133, 12, 149, 0.8)";
theCanvas.style.margin = "20px";

const window_height = 700;
const window_width = 1100;

theCanvas.height = window_height;
theCanvas.width = window_width;
theCanvas.style.background = "#2A363B";

function getRandomColor() {
    return `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;
}

const collisionSound = new Audio("colision.mp3");

class Circle {
    constructor(x, y, radius, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.fillColor = getRandomColor();
        this.dx = (Math.random() > 0.5 ? 1 : -1) * speed;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * speed;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.fillColor;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.strokeStyle = "#FFF";
        context.lineWidth = 3;
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        if ((this.posX + this.radius) >= window_width || (this.posX - this.radius) <= 0) {
            this.dx = -this.dx;
        }
        if ((this.posY + this.radius) >= window_height || (this.posY - this.radius) <= 0) {
            this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }
}

function detectCollisions(circles) {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            let dx = circles[i].posX - circles[j].posX;
            let dy = circles[i].posY - circles[j].posY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < circles[i].radius + circles[j].radius) {
                let tempDx = circles[i].dx;
                let tempDy = circles[i].dy;
                circles[i].dx = circles[j].dx;
                circles[i].dy = circles[j].dy;
                circles[j].dx = tempDx;
                circles[j].dy = tempDy;

                circles[i].fillColor = getRandomColor();
                circles[j].fillColor = getRandomColor();

                collisionSound.cloneNode(true).play();
            }
        }
    }
}

let circles = [];
let numCircles = 10;
function generateCircles() {
    circles = [];
    for (let i = 0; i < numCircles; i++) {
        let radius = Math.floor(Math.random() * 30) + 20;
        let x = Math.random() * (window_width - 2 * radius) + radius;
        let y = Math.random() * (window_height - 2 * radius) + radius;
        let speed = 3;
        circles.push(new Circle(x, y, radius, speed));
    }
}

generateCircles();

let animationRunning = true;
function updateCircles() {
    if (animationRunning) {
        requestAnimationFrame(updateCircles);
        ctx.clearRect(0, 0, window_width, window_height);
        detectCollisions(circles);
        circles.forEach(circle => circle.update(ctx));
    }
}

updateCircles();

const controls = document.createElement("div");
controls.style.display = "flex";
controls.style.alignItems = "center";
controls.style.marginTop = "15px";

document.body.appendChild(controls);

const button = document.createElement("button");
button.innerHTML = "Pausa";
button.style.padding = "15px 25px";
button.style.fontSize = "20px";
button.style.fontWeight = "bold";
button.style.cursor = "pointer";
button.style.border = "3px solid #FF6F61";
button.style.borderRadius = "15px";
button.style.background = "#FF6F61";
button.style.color = "white";
button.style.boxShadow = "3px 3px 10px rgba(0,0,0,0.3)";
button.style.transition = "0.3s";
button.onmouseover = () => button.style.background = "#FC5130";
button.onmouseleave = () => button.style.background = "#FF6F61";
button.onclick = () => {
    animationRunning = !animationRunning;
    button.innerHTML = animationRunning ? "Pausa" : "Reanudar";
    if (animationRunning) {
        updateCircles();
    }
};

controls.appendChild(button);
