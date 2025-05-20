const symbols = ["🍒", "🍒", "🍒", "🍇", "🍇", "🍇", "🔔", "🔔","🍉", "🍉", "🍉","7️⃣"];
const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
];
let isSpinning = false;
let credits = parseInt(localStorage.getItem("credits"), 10);
if (isNaN(credits)) {
    credits = 100;
}

let odd = 0;
let isDevMode = false;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("credits").textContent = credits;
});

Object.defineProperty(window, "odd", { // window.odd = value;
    set(value) {
        if (value >= 0 && value <= 1) {
            odd = value;
            console.log(`Odd value set to ${odd}`);
        } else {
            console.error("Invalid odd value. It must be between 0 and 1.");
        }
    },
    get() {
        return odd;
    }
});

let baseFontSize = 16; // Default base font size

// Load font size from localStorage if available
const savedFontSize = localStorage.getItem("fontSize");
if (savedFontSize) {
    document.body.style.fontSize = savedFontSize + "px";
    baseFontSize = parseInt(savedFontSize, 10);
}

function adjustFontSize(value) {
    const newSize = baseFontSize + parseInt(value, 10);
    document.body.style.fontSize = newSize + "px";
    localStorage.setItem("fontSize", newSize);
    baseFontSize = newSize; // Update baseFontSize for subsequent adjustments
}

function resetFontSize() {
    const defaultFontSize = 16; // Default font size
    document.body.style.fontSize = defaultFontSize + "px";
    localStorage.setItem("fontSize", defaultFontSize);
    baseFontSize = defaultFontSize;

    // Reset the range slider to 0
    document.getElementById("font-size").value = 0;
}

// Function to update the credits display with the selected decimal places
function updateCreditsDisplay() {
    const decimalPlaces = parseInt(document.getElementById("decimal").value, 10);
    localStorage.setItem("decimalPlaces", decimalPlaces); // Save to localStorage
    const formattedCredits = credits.toFixed(decimalPlaces);
    document.getElementById("credits").textContent = formattedCredits;
}

function resetDecimal() {
    const defaultDecimal = 2; // Default decimal places
    document.getElementById("decimal").value = defaultDecimal;
    localStorage.setItem("decimalPlaces", defaultDecimal); // Save to localStorage
    updateCreditsDisplay(); // Update the display with the default decimal places
}

// Update credits and adjust the display
function updateCredits(amount) {
    credits += amount;
    credits = parseFloat(credits.toFixed(2)); // Keep credits precise to 2 decimals internally
    localStorage.setItem("credits", credits);
    updateCreditsDisplay(); // Update the display with the selected decimal places
}

// Event listener for the "Credits decimal" input
document.getElementById("decimal").addEventListener("input", updateCreditsDisplay);

// Initialize the credits display and decimal input on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedDecimal = localStorage.getItem("decimalPlaces");
    if (savedDecimal !== null) {
        document.getElementById("decimal").value = savedDecimal;
    }
    updateCreditsDisplay();
});

function fillSymbols(reelDiv) {
    const symbolsDiv = reelDiv.querySelector(".symbols");
    symbolsDiv.innerHTML = "";
    
    for (let i = 0; i < 4; i++) {
        const randSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        const el = document.createElement("div");
        el.textContent = randSymbol;
        el.style.height = "80px";
        symbolsDiv.appendChild(el);
    }
}

function startSpin() {
    if (isSpinning) return;
    const betAmount = parseInt(document.getElementById("bet").value, 10);
    if (betAmount > credits || betAmount <= 0) {
        alert("Invalid bet amount!");
        return;
    }

    isSpinning = true;
    updateCredits(-betAmount);

    const results = [];
    reels.forEach((reel, i) => {
        const symbolsDiv = reel.querySelector(".symbols");
        symbolsDiv.style.animation = "spin 0.3s linear infinite";
        fillSymbols(reel);

        setTimeout(() => {
            symbolsDiv.style.animation = "none";
            let finalSymbol = "";
            if (odd === 0) {
                finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            } else if (odd > 0 && odd < 1) {
                if (i === 0) {
                    const randomIndex = Math.floor(Math.random() * 10) < odd * 10 ? symbols.indexOf("7️⃣") : Math.floor(Math.random() * symbols.length);
                    finalSymbol = symbols[randomIndex];
                } else {
                    finalSymbol = results[0] === "7️⃣" ? "7️⃣" : symbols[Math.floor(Math.random() * symbols.length)];
                }
            } else if (odd === 1) {
                finalSymbol = "7️⃣";
            }
            symbolsDiv.innerHTML = `<div style="height:80px">${finalSymbol}</div>`;
            results[i] = finalSymbol;

            if (i === reels.length - 1) {
                calculateWinnings(results, betAmount);
                isSpinning = false;
            }
        }, 1000 + i * 500);
    });
}

function calculateWinnings(results, betAmount) {
    const [r1, r2, r3] = results;
    let multiplier = 0;

    if (r1 === r2 && r2 === r3) {
        if (r1 === "🍒") multiplier = 10;
        else if (r1 === "🍇") multiplier = 10;
        else if (r1 === "🍉") multiplier = 10;
        else if (r1 === "🔔") multiplier = 25;
        else if (r1 === "7️⃣") multiplier = 100;
    }

    const winnings = betAmount * multiplier;
    updateCredits(winnings);
    document.getElementById("win").textContent = "x" + multiplier;
}

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("collapsed");
}

function saveCurrentSection(section) {
    localStorage.setItem("currentSection", section);
}

function loadLastSection() {
    const lastSection = localStorage.getItem("currentSection");
    if (lastSection) {
        if (lastSection === "slot") showSlotGame();
        else if (lastSection === "chicken") showChickenGame();
        else if (lastSection === "help") showHelp();
        else if (lastSection === "settings") showSettings();
        else if (lastSection === "home") showHome();
        else showHome();
    } else {
        showHome();
    }
}

function showSlotGame() {
    saveCurrentSection("slot");
    document.getElementById("games-section").style.display = "none";
    document.getElementById("slot-section").style.display = "block";
    document.getElementById("help-section").style.display = "none";
    document.getElementById("chicken-section").style.display = "none";
    document.getElementById("settings-section").style.display = "none";
}

function showChickenGame() {
    saveCurrentSection("chicken");
    document.getElementById("games-section").style.display = "none";
    document.getElementById("slot-section").style.display = "none";
    document.getElementById("help-section").style.display = "none";
    document.getElementById("chicken-section").style.display = "block";
    document.getElementById("settings-section").style.display = "none";
}

function showHome() {
    saveCurrentSection("home");
    document.getElementById("games-section").style.display = "block";
    document.getElementById("slot-section").style.display = "none";
    document.getElementById("help-section").style.display = "none";
    document.getElementById("chicken-section").style.display = "none";
    document.getElementById("settings-section").style.display = "none";
}

function showHelp() {
    saveCurrentSection("home");
    document.getElementById("games-section").style.display = "none";
    document.getElementById("slot-section").style.display = "none";
    document.getElementById("help-section").style.display = "block";
    document.getElementById("chicken-section").style.display = "none";
    document.getElementById("settings-section").style.display = "none";
}

function showSettings() {
    saveCurrentSection("settings");
    document.getElementById("games-section").style.display = "none";
    document.getElementById("slot-section").style.display = "none";
    document.getElementById("help-section").style.display = "none";
    document.getElementById("chicken-section").style.display = "none";
    document.getElementById("settings-section").style.display = "block";
}

document.addEventListener("DOMContentLoaded", loadLastSection);

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
let currentMultiplier = 1.00;
let bet = 0;
let playing = false;
let difficulty = "easy";
const multipliersByDiff = {
    easy: 0.06,
    medium: 0.12,
    hard: 0.2,
    hardcore: 0.35
};

let deathStep = -1;

let multipliers = [];

document.getElementById('min-bet-button').addEventListener('click', () => {
    document.getElementById('bet-input').value = 0.01;
});

document.getElementById('max-bet-button').addEventListener('click', () => {
    const credits = parseFloat(document.getElementById('credits').textContent) || 0;
    document.getElementById('bet-input').value = credits.toFixed(2);
});

function generateSteps(count = 10) {
    road.innerHTML = "";
    multipliers = [];
    for (let i = 0; i < count; i++) {
        const step = document.createElement("div");
        step.classList.add("step");

        // Calculate the multiplier exponentially based on difficulty
        let baseMultiplier = 1.1; // Base multiplier for exponential growth
        let growthFactor = multipliersByDiff[difficulty]; // Growth factor based on difficulty
        let multi = (baseMultiplier * Math.pow(1 + growthFactor, i)).toFixed(2);
        multipliers.push(parseFloat(multi));

        step.innerHTML = `
        <div class="multiplier">${multi}x</div>
        <div class="potential">$0.00</div>
        `;
        road.appendChild(step);

        // Add a line between steps
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

function adjustRoadVisibility() {
    const roadWidth = road.offsetWidth;
    const windowWidth = window.innerWidth;

    if (roadWidth > windowWidth) {
        road.style.maxWidth = `${windowWidth}px`;
        road.style.overflowX = "hidden";
    } else {
        road.style.maxWidth = "100%";
        road.style.overflowX = "visible";
    }
}

function updateChickenPosition() {
    const steps = document.querySelectorAll(".step");
    const roadWidth = road.offsetWidth;
    const windowWidth = window.innerWidth;

    if (stepIndex === -1) {
        // Position the chicken off-screen to the left, but adjust based on window size
        chicken.style.left = `${Math.min(-80, -roadWidth / 10)}px`;
    } else if (stepIndex >= steps.length) {
        // Position the chicken at the end of the road, but ensure it doesn't overflow
        chicken.style.left = `${Math.min(roadWidth - chicken.offsetWidth, windowWidth - chicken.offsetWidth - 20)}px`;

    } else {
        // Position the chicken on the current step
        const step = steps[stepIndex];
        const offsetLeft = step.offsetLeft + step.offsetWidth / 2 - chicken.offsetWidth / 2;
        chicken.style.left = `${Math.min(offsetLeft, roadWidth - chicken.offsetWidth)}px`;

    }
}

// Ensure the chicken's position updates dynamically when the window is resized
window.addEventListener("resize", () => {
    adjustRoadVisibility();
});

// Ensure road visibility is adjusted when the game starts
document.addEventListener("DOMContentLoaded", () => {
    adjustRoadVisibility();
    loadLastSection();
});

function updatePotentials() {
    const steps = document.querySelectorAll(".step");
    steps.forEach((step, i) => {
        const multi = multipliers[i];
        const pot = (multi * bet).toFixed(2);
        step.querySelector(".potential").innerText = `$${pot}`;
    });
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

    // Disable difficulty buttons once the game starts
    document.querySelectorAll(".difficulty").forEach(btn => btn.setAttribute("disabled", "true"));

    playButton.style.display = "none";
    inGameButtons.style.display = "flex";
    stepIndex = -1; // Ensure the chicken starts off-screen and doesn't move
    playing = true;
    generateSteps();
    updatePotentials();
    message.innerText = "";

    setDefaultChickenPosition(); // Reset the chicken to the default position
}

function stepForward() {
    if (!playing || stepIndex >= multipliers.length) return;

    // Increment the step index only when "Go" is clicked
    if (stepIndex === -1) {
        setDefaultChickenPosition();
        stepIndex = 0; // Move to the first step on the first click
    } else {
        stepIndex++;
    }

    if (stepIndex >= multipliers.length) {
        if (stepIndex > 0 && stepIndex <= multipliers.length) {
            const winnings = (bet * multipliers[stepIndex - 1]).toFixed(2);
            message.innerText = `🏁 You safely crossed the road and won $${winnings}!`;
        } else {
            message.innerText = `🏁 You safely crossed the road but no winnings were calculated.`;
        }
        cashOut();
        return;
    }

    // Check for crash
    if (Math.random() < multipliersByDiff[difficulty]) {
        triggerCrash();
        return;
    }

    // Add a barrier to the current step
    if (stepIndex >= 0 && stepIndex < multipliers.length) {
        const barrier = document.createElement("div");
        barrier.classList.add("barrier");
        document.querySelectorAll(".step")[stepIndex].appendChild(barrier);
    }

    // Update the chicken's position
    updateChickenPosition();
}

function triggerCrash() {
    if (stepIndex >= 0 && stepIndex < multipliers.length) {
        // Move the chicken forward to the next step before the crash
        const step = document.querySelectorAll(".step")[stepIndex];
        const offsetLeft = step.offsetLeft + step.offsetWidth / 2 - chicken.offsetWidth / 2;
        chicken.style.left = `${offsetLeft}px`;
        chicken.style.bottom = "20px"; // Adjust as needed for proper alignment
    }

    playing = false;

    // Create the car element
    const car = document.createElement("div");
    car.classList.add("car");
    road.appendChild(car);
    car.style.left = chicken.style.left;

    // Trigger the crash animation
    setTimeout(() => {
        car.style.top = "30px";
    }, 50);

    // Display the crash message and reset the game state
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

function setDefaultChickenPosition() {
    const roadHeight = road.offsetHeight;
    const chickenHeight = chicken.offsetHeight;
    chicken.style.left = "-80px"; // Position off-screen to the left
    chicken.style.bottom = `${(roadHeight - chickenHeight) / 2 + 40}px`; // Center vertically on the left side and raise it slightly
}

document.addEventListener("DOMContentLoaded", () => {
    setDefaultChickenPosition();
    adjustRoadVisibility();
    loadLastSection();
});
function cashOut() {
    if (!playing) return;

    let winnings = 0;
    if (stepIndex < 0) {
        // If no steps have been taken, refund the bet
        winnings = bet; // Refund the bet amount
        message.innerText = `💰 You cashed out without taking any steps. Your bet of $${winnings.toFixed(2)} has been refunded!`;
    } else if (stepIndex > 0 && stepIndex <= multipliers.length) {
        // If the player hasn't reached the last step, calculate winnings
        winnings = (bet * multipliers[stepIndex - 1]).toFixed(2);
        message.innerText = `💰 You cashed out with $${winnings}!`;
    } else {
        // If the player has reached the last step, they safely reached the sideline
        winnings = (bet * multipliers[stepIndex - 1]).toFixed(2);
        message.innerText = `🏁 You safely reached the sideline and won $${winnings}!`;
    }

    updateCredits(parseFloat(winnings) || 0); // Ensure winnings are a valid number

    inGameButtons.style.display = "none";
    playButton.style.display = "inline-block";
    stepIndex = -1;
    playing = false;
    resetCHickenPosition();

    // Re-enable difficulty buttons after the game ends
    document.querySelectorAll(".difficulty").forEach(btn => btn.removeAttribute("disabled"));
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
    loadLastSection();

    // Highlight the selected difficulty when the game loads
    document.querySelectorAll(".difficulty").forEach(btn => btn.classList.remove("selected"));
    document.querySelector(`.difficulty[data-diff="${difficulty}"]`).classList.add("selected");
});



generateSteps();

