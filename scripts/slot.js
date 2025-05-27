const symbols = ["🍒","🍇","🔔", "🍉", "7️⃣"];
const reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];
let isSpinning = false;

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
            if (raccoon === true) {
                finalSymbol = "7️⃣";
            } else {
                finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
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
    }else {
      if  (["🍒", "🍇", "🍉"].includes(r1)) {
            if  (["🍒", "🍇", "🍉"].includes(r2)) {
                if  (["🍒", "🍇", "🍉"].includes(r3)) {
                    multiplier = 1.5;
                }
            }
        }
    }

    let winnings = betAmount * multiplier;

    winnings = payLoanAutomatically(winnings);

    updateCredits(winnings);
    document.getElementById("win").textContent = "x" + multiplier;
}