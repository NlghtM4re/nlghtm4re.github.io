const road = document.getElementById("road");
const line = document.getElementById("line");
const betInput = document.getElementById("bet-input");
const playButton = document.getElementById("play-button");
const cashoutButton = document.getElementById("cashout-button");
const goButton = document.getElementById("go-button");
const inGameButtons = document.getElementById("in-game-buttons");
const message = document.getElementById("message");

let chicken = document.createElement("div");
chicken.classList.add("chicken");
road.appendChild(chicken);

let stepIndex = -1;
let bet = 0;
let playing = false;
let difficulty = "easy";
let crashStep = null;

const multipliersByDiff = {
    easy: 0.06,
    medium: 0.2,
    hard: 0.5,
    hardcore: 1
};

const crashDistributions = {
    easy: 0.93,
    medium: 0.85,
    hard: 0.75,
    hardcore: 0.60
};

let multipliers = [];

document.getElementById('min-bet-button').addEventListener('click', () => {
    document.getElementById('bet-input').value = 0.01;
    bet = 0.01;
    updatePotentials();
});

document.getElementById('max-bet-button').addEventListener('click', () => {
    const credits = parseFloat(document.getElementById('credits').textContent) || 0;
    document.getElementById('bet-input').value = credits.toFixed(2);
    bet = credits;
    updatePotentials();
});

function precalculateCrashStep(stepsCount = 10) {
    const surviveChance = crashDistributions[difficulty];
    crashStep = stepsCount; // Default: survives all steps
    for (let i = 0; i < stepsCount; i++) {
        if (Math.random() > surviveChance) {
            crashStep = i;
            break;
        }
    }
}

function generateSteps(count = 10) {
    road.innerHTML = "";
    multipliers = [];
    for (let i = 0; i < count; i++) {
        const step = document.createElement("div");
        step.classList.add("step");

        let baseMultiplier = 1.1; 
        let growthFactor = multipliersByDiff[difficulty];
        let multi = (baseMultiplier * Math.pow(1 + growthFactor, i)).toFixed(2);
        multipliers.push(parseFloat(multi));

        step.innerHTML = `
        <div class="multiplier">${multi}x</div>
        <div class="potential">$0.00</div>
        `;
        road.appendChild(step);

        const line = document.createElement("div");
        line.classList.add("line");
        road.appendChild(line);

        if (i === 0) {
            const startLine = document.createElement("div");
            startLine.classList.add("line");
            road.insertBefore(startLine, road.firstChild);
        }
    }
    road.appendChild(chicken);
}

function updateChickenPosition() {
    const steps = document.querySelectorAll(".step");
    const roadWidth = road.offsetWidth;
    const windowWidth = window.innerWidth;

    if (stepIndex === -1) {
        chicken.style.left = `${Math.min(-80, -roadWidth / 10)}px`;
    } else if (stepIndex >= steps.length) {
        chicken.style.left = `${Math.min(roadWidth - chicken.offsetWidth, windowWidth - chicken.offsetWidth - 20)}px`;
    } else {
        const step = steps[stepIndex];
        const offsetLeft = step.offsetLeft + step.offsetWidth / 2 - chicken.offsetWidth / 2;
        chicken.style.left = `${Math.min(offsetLeft, roadWidth - chicken.offsetWidth)}px`;
    }
}

function updatePotentials() {
    const steps = document.querySelectorAll(".step");
    steps.forEach((step, i) => {
        const multi = multipliers[i];
        const pot = (multi * bet).toFixed(2);
        step.querySelector(".potential").innerText = `$${pot}`;
    });
}

function setDefaultChickenPosition() {
    const roadHeight = road.offsetHeight;
    const chickenHeight = chicken.offsetHeight;
    chicken.style.left = "-80px"; 
    chicken.style.bottom = `${(roadHeight - chickenHeight) / 2 + 40}px`;
}

function resetCHickenPosition() {
    setDefaultChickenPosition();
}

function showWouldHaveDiedStep() {
    if (crashStep !== null && crashStep < multipliers.length) {
        const steps = document.querySelectorAll(".step");
        const step = steps[crashStep];
        if (step && !step.classList.contains("would-have-died")) {
            step.classList.add("would-have-died");
            step.appendChild(marker);
        }
    }
}

function startGame() {
    bet = parseFloat(betInput.value);
    if (isNaN(bet) || bet <= 0 || bet > credits) {
        alert("Invalid bet amount or insufficient credits!");
        return;
    }

    updateCredits(-bet);

    document.querySelectorAll(".difficulty").forEach(btn => btn.classList.remove("selected"));
    document.querySelector(`.difficulty[data-diff="${difficulty}"]`).classList.add("selected");

    document.querySelectorAll(".difficulty").forEach(btn => btn.setAttribute("disabled", "true"));

    playButton.style.display = "none";
    inGameButtons.style.display = "flex";
    stepIndex = -1; 
    playing = true;
    generateSteps();
    updatePotentials();
    message.innerText = "";

    setDefaultChickenPosition(); 

    precalculateCrashStep(multipliers.length);

    // Remove previous would-have-died markers
    document.querySelectorAll(".would-have-died").forEach(step => {
        step.classList.remove("would-have-died");
        const marker = step.querySelector(".would-have-died-marker");
        if (marker) marker.remove();
    });
}

function stepForward() {
    if (!playing || stepIndex >= multipliers.length) return;

    if (stepIndex === -1) {
        setDefaultChickenPosition();
        stepIndex = 0;
    } else {
        stepIndex++;
    }

    if (stepIndex >= multipliers.length) {
        if (stepIndex > 0 && stepIndex <= multipliers.length) {
            const winnings = (bet * multipliers[stepIndex - 1]).toFixed(2);
            message.innerText = `🏁 You safely crossed the road and won $${winnings}!`;
            document.querySelectorAll(".difficulty").forEach(btn => btn.removeAttribute("disabled"));
        }
        cashOut();
        return;
    }

    // Precalculated crash
    if (stepIndex === crashStep) {
        triggerCrash();
        return;
    }

    if (stepIndex >= 0 && stepIndex < multipliers.length) {
        const barrier = document.createElement("div");
        barrier.classList.add("barrier");
        document.querySelectorAll(".step")[stepIndex].appendChild(barrier);
    }

    updateChickenPosition();
}

function triggerCrash() {
    if (stepIndex >= 0 && stepIndex < multipliers.length) {
        const step = document.querySelectorAll(".step")[stepIndex];
        const offsetLeft = step.offsetLeft + step.offsetWidth / 2 - chicken.offsetWidth / 2;
        chicken.style.left = `${offsetLeft}px`;
        chicken.style.bottom = "20px"; 
    }

    playing = false;

    const car = document.createElement("div");
    car.classList.add("car");
    road.appendChild(car);
    car.style.left = chicken.style.left;

    setTimeout(() => {
        car.style.top = "30px";
    }, 50);

    setTimeout(() => {
        message.innerText = `💥 You lost $${bet.toFixed(2)}. The chicken got hit!`;
        inGameButtons.style.display = "none";
        playButton.style.display = "inline-block";

        document.querySelectorAll(".difficulty").forEach(btn => btn.removeAttribute("disabled"));

        stepIndex = -1;
        resetCHickenPosition();
        
        car.remove();
    }, 1000);
}

function cashOut() {
    if (!playing) return;

    let winnings = 0;
    if (stepIndex < 0) {
        winnings = bet; 
        message.innerText = `💰 You cashed out without taking any steps. Your bet of $${winnings.toFixed(2)} has been refunded!`;
    } else if (stepIndex >= 0 && stepIndex < multipliers.length) {
        winnings = (bet * multipliers[stepIndex]).toFixed(2);
        message.innerText = `💰 You cashed out with $${winnings}!`;
    } else {
        winnings = (bet * multipliers[multipliers.length - 1]).toFixed(2);
        message.innerText = `🏁 You safely reached the sideline and won $${winnings}!`;
    }

    document.querySelectorAll(".difficulty").forEach(btn => btn.removeAttribute("disabled"));

    winnings = payLoanAutomatically(parseFloat(winnings) || 0);

    updateCredits(winnings); 

    inGameButtons.style.display = "none";
    playButton.style.display = "inline-block";
    playing = false;

    showWouldHaveDiedStep();

    stepIndex = -1;
    resetCHickenPosition();
}

betInput.addEventListener("input", () => {
    bet = parseFloat(betInput.value);
    updatePotentials();
});
betInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        bet = parseFloat(betInput.value);
        updatePotentials();
    }
});

playButton.onclick = startGame;
goButton.onclick = stepForward;
cashoutButton.onclick = cashOut;

document.querySelectorAll(".difficulty").forEach(button => {
    button.onclick = () => {
        difficulty = button.dataset.diff;
        document.querySelectorAll(".difficulty").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        generateSteps();
        updatePotentials();
    };
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".difficulty").forEach(btn => btn.classList.remove("selected"));
    document.querySelector(`.difficulty[data-diff="${difficulty}"]`).classList.add("selected");
    setDefaultChickenPosition();
});

generateSteps();