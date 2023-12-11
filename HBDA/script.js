const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let balloonsArray = [];
let sparklesArray = [];

function Balloon() {
    this.x = Math.floor(Math.random() * window.innerWidth);
    this.y = window.innerHeight;
    this.radius = Math.floor(Math.random() * 20 + 20);
    this.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
    this.speedY = Math.random() * 2 + 2;
    this.popped = false;

    // Tail properties
    this.tailLength = Math.floor(Math.random() * 50 + 30); // Adjust the tail length
    this.tailCurls = Math.floor(Math.random() * 2) + 2; // Adjust the number of curls (2-3 curls)
    this.tailColor = 'lightgray'; // Set the tail color here

    this.update = () => {
        if (!this.popped) {
            this.y -= this.speedY;
        }

        // Simulate all balloons popping after a certain duration (e.g., 5000 milliseconds)
        if (!this.popped && Date.now() - this.creationTime > 3000) {
            this.popped = true;
            createSparkles(this.x, this.y, this.color);
        }
    };

    this.draw = () => {
        if (!this.popped) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();

            // Draw a differently shaped and long tail for each balloon
            context.beginPath();
            context.moveTo(this.x, this.y + this.radius);
            context.strokeStyle = this.tailColor; // Set the tail color

            for (let i = 0; i < this.tailCurls; i++) {
                const angle = (i % 2 === 0 ? 1 : -1) * (i + 1) * 0.2; // Adjust the angle for curls
                const controlPointX = this.x + Math.cos(angle) * (i + 1) * 10;
                const controlPointY = this.y + this.radius + this.tailLength / this.tailCurls * (i + 1);
                const endPointX = this.x;
                const endPointY = this.y + this.radius + this.tailLength / this.tailCurls * (i + 1);

                context.quadraticCurveTo(controlPointX, controlPointY, endPointX, endPointY);
            }

            context.stroke();
        }
    };

    // Record the creation time of the balloon
    this.creationTime = Date.now();
}

function Sparkle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.floor(Math.random() * 3 + 6);
    this.speedY = Math.random() * 2 - 2;
    this.speedX = Math.round((Math.random() - 0.5) * 10);
    this.velocity = Math.random() / 5;

    this.update = () => {
        if (this.size > 0.2) {
            this.size -= 0.1;
        }
        this.y += this.speedY;
        this.x += this.speedX;
        this.speedY += this.velocity;
    };

    this.draw = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    };
}

function createSparkles(x, y, color) {
    for (let i = 0; i < 50; i++) {
        sparklesArray.push(new Sparkle(x, y, color));
    }
}

function animate() {
    context.fillStyle = `rgba(24, 28, 31, .2)`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = `white`;
    renderBalloons();
    renderSparkles();
    requestAnimationFrame(animate);
}

function renderBalloons() {
    for (let i = 0; i < balloonsArray.length; i++) {
        balloonsArray[i].draw();
        balloonsArray[i].update();

        if (balloonsArray[i].popped || balloonsArray[i].y + balloonsArray[i].radius < 0) {
            balloonsArray.splice(i, 1);
            i--;
        }
    }
}

function renderSparkles() {
    for (let i = 0; i < sparklesArray.length; i++) {
        sparklesArray[i].draw();
        sparklesArray[i].update();

        if (sparklesArray[i].size <= 0.2) {
            sparklesArray.splice(i, 1);
            i--;
        }
    }
}

animate();

setInterval(() => {
    balloonsArray.push(new Balloon());
}, 1500);
