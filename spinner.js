const canvas = document.getElementById("spinnerCanvas");
const ctx = canvas.getContext("2d");
const options = [];
let rotationAngle = 0; // Current rotation angle of the wheel

// Function to resize canvas dynamically
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8; // 80% of the smaller dimension
    canvas.width = size;
    canvas.height = size;
    drawWheel();
}

function drawMarker() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const markerWidth = canvas.width * 0.05; // Adjust marker size dynamically
    const markerHeight = canvas.height * 0.1;

    // Draw a static marker (doesn't rotate)
    ctx.fillStyle = "red"; // Marker color
    ctx.beginPath();
    ctx.moveTo(centerX - markerWidth / 2, centerY - canvas.height / 2); // Left point of triangle
    ctx.lineTo(centerX + markerWidth / 2, centerY - canvas.height / 2); // Right point of triangle
    ctx.lineTo(centerX, centerY - canvas.height / 2 + markerHeight); // Bottom point of triangle
    ctx.closePath();
    ctx.fill();
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;
    const segmentAngle = (2 * Math.PI) / options.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotationAngle * Math.PI) / 180); // Rotate the wheel based on the angle
    ctx.translate(-centerX, -centerY);

    options.forEach((option, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = startAngle + segmentAngle;

        // Draw segment fill
        ctx.fillStyle = `hsl(${(index / options.length) * 360}, 80%, 70%)`;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        // Draw segment border
        ctx.strokeStyle = "black"; // Set border color to black
        ctx.lineWidth = 2; // Set border thickness
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        // ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.font = `${Math.floor(radius / 10)}px Arial`; // Adjust font size dynamically
        ctx.fillText(option, radius / 2, 10);
        ctx.restore();
    });

    ctx.restore();
    drawMarker(); // Draw marker on top
}

function spinWheel() {
    const spinDuration = 3000; // Spin time in milliseconds
    const randomSpin = Math.random() * 360 + 7200; // Randomized spin angle (20 full spins plus randomness)
    const finalRotation = rotationAngle + randomSpin; // Final target rotation angle
    const startRotation = rotationAngle; // Start point for spinning

    let startTime;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / spinDuration;

        // Calculate eased rotation angle for smooth stopping
        if (progress < 1) {
            const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic easing for smooth slowdown
            rotationAngle =
                startRotation + (finalRotation - startRotation) * easeOut;
            rotationAngle = rotationAngle % 360; // Keep angle within 0-360 degrees
            drawWheel(); // Redraw the wheel with updated rotation
            requestAnimationFrame(animate);
        } else {
            // Final stop
            // rotationAngle = finalRotation % 360;
            // Calculate winning segment
            // const normalizedAngle = (360 - rotationAngle) % 360; // Ensure angle is positive and normalized
            // const segmentAngle = 360 / options.length;
            // const winningIndex =
            //     Math.floor(normalizedAngle / segmentAngle) % options.length;
            // // Show result
            // alert(`The winner is: ${options[winningIndex]}!`);
        }
    }

    requestAnimationFrame(animate);
}

document.getElementById("spinButton").addEventListener("click", () => {
    if (options.length > 0) {
        spinWheel();
    } else {
        alert("Please add options before spinning!");
    }
});

document.getElementById("optionsForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("optionInput");
    const option = input.value.trim();
    if (option && !(option.length > 21)) {
        // Check if option is not empty and less than 21 characters
        options.push(option);
        input.value = "";
        drawWheel();
    } else if (option.length > 20) {
        alert("Option must be less than 20 characters!");
    } else {
        alert("Please enter a valid option!");
    }
});

// Handle resizing
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initialize canvas size

// Initial options for demonstration
options.push(
    "Dinh",
    "Eoin",
    "Bishal",
    "David",
    "Beibhinn",
    "Matthew",
    "Abhishek"
);
drawWheel(); // Initial draw

// Randomise colors button
// when clicked it actually just randomises the order of the options
document
    .getElementById("randomiseColorsButton")
    .addEventListener("click", () => {
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        drawWheel(); // Redraw the wheel with new order
    });

// Reset button to clear options
document.getElementById("resetButton").addEventListener("click", () => {
    options.length = 0; // Clear options
    drawWheel(); // Redraw the wheel
});

// Remove last option button
document.getElementById("removeButton").addEventListener("click", () => {
    options.pop(); // Remove last option
    console.log(options);
    drawWheel(); // Redraw the wheel
    if (options.length === 0) {
        alert("No options left!");
    }
});
