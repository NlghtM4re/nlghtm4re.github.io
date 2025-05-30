const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'blue';
ctx.lineWidth = 2;

let speed = 0.01;
let curvePoints = [];
let gameLoop;
let success;
let crashed = false;
let betAmount = 0;
let profitsTaken = false;
let rocketPosition = { x: 0, y: 0 };

const betAmountInput = document.getElementById('betAmount');

// Game functions
function startGame() {
    curvePoints = [{ x: 0, y: canvas.height }];
    updateCurve();
}

function updateCurvePoints() {
    const lastPoint = curvePoints[curvePoints.length - 1];
    const newX = lastPoint.x + 1;
    const newY = canvas.height - (Math.pow(newX, 1.75) / 100);
    curvePoints.push({ x: newX, y: newY });
    document.getElementById('currentMultiplier').innerText = (curvePoints.length / 100).toFixed(2) + 'x';
}

function updateCurve() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    for (let i = 0; i < curvePoints.length; i++) {
        const { x, y } = curvePoints[i];
        ctx.lineTo(x, y);
    }

    ctx.stroke();

    if (!crashed) {
        const lastPoint = curvePoints[curvePoints.length - 1];

        if (curvePoints.length >= 2) {
            const secondLastPoint = curvePoints[curvePoints.length - 2];
            const deltaX = lastPoint.x - secondLastPoint.x;
            const deltaY = lastPoint.y - secondLastPoint.y;
            const angle = Math.atan2(deltaY, deltaX) + Math.PI / 4;

            ctx.save();
            ctx.translate(lastPoint.x, lastPoint.y);
            ctx.rotate(angle);
            ctx.font = '30px Arial';
            ctx.fillText('🚀', 0, -10);
            ctx.restore();

            rocketPosition = { x: lastPoint.x, y: lastPoint.y };
        }
    } else {
        const crashPosition = { x: rocketPosition.x, y: rocketPosition.y - 10 };
        const crashAngle = Math.atan2(rocketPosition.y - curvePoints[curvePoints.length - 2].y, rocketPosition.x - curvePoints[curvePoints.length - 2].x) + Math.PI / 4;

        ctx.save();
        ctx.translate(crashPosition.x, crashPosition.y);
        ctx.rotate(crashAngle);
        ctx.font = '30px Arial';
        ctx.fillText('💥', 0, 0);
        ctx.restore();
    }
}

function getRandomCrashTime(min, max) {
    return (Math.random() * (max - min) + min) * 1000;
}

function crashCurve() {
    clearInterval(gameLoop);
    crashed = true;

    const multiplier = curvePoints.length / 100;
    let profit = 0;
    let status = "Lost";

    if (profitsTaken) {
        profit = betAmount * multiplier;
        profit = payLoanAutomatically(profit);
        updateCredits(profit);
        status = "Won";
    }

    const crashLog = document.createElement("div");
    crashLog.classList.add("crash-entry");
    crashLog.innerHTML = `
        <span>💥 ${multiplier.toFixed(2)}x</span>
        <span>🎲 Bet: ${betAmount}</span>
        <span>${status === "Won" ? "✅" : "❌"} ${status}</span>
        <span>${status === "Won" ? `+${profit.toFixed(2)}` : "-"} </span>
    `;
    crashLog.style.color = status === "Won" ? "lime" : "red";

    document.getElementById("lastCrashes").prepend(crashLog);

    updateCurve();
}


// Event: Place bet
document.getElementById('submitBet').addEventListener('click', function () {
    const betValue = parseFloat(betAmountInput.value);
    if (credits >= betValue && betValue > 0) {
        updateCredits(-betValue);
        crashed = false;
        profitsTaken = false;
        betAmount = betValue;
        startGame();

        gameLoop = setInterval(() => {
            updateCurvePoints();
            updateCurve();
        }, 16);

        setTimeout(() => crashCurve(), getRandomCrashTime(1, 5.5));
    } else {
        alert("Insufficient credits or invalid bet.");
    }
});

function setMinBet() {
    document.getElementById('betAmount').value = 1;
}

function setMaxBet() {
    document.getElementById('betAmount').value = Math.floor(credits);
}

document.getElementById("takeProfits").addEventListener("click", function () {
    if (!crashed && !profitsTaken) {
        profitsTaken = true;
        const multiplier = curvePoints.length / 100;
        let profit = betAmount * multiplier;
        profit = payLoanAutomatically(profit);
        updateCredits(profit);
    }
});


// On load
document.addEventListener("DOMContentLoaded", () => {
    const savedCredits = localStorage.getItem("credits");
    if (savedCredits !== null) {
        credits = parseFloat(savedCredits);
    }
    updateCreditsDisplay();
});
