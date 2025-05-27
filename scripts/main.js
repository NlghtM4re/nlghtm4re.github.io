let credits = parseFloat(localStorage.getItem("credits"));
if (isNaN(credits)) {
    credits = 100;
    localStorage.setItem("credits", credits.toFixed(2));
}
let dept = parseFloat(localStorage.getItem("dept"));
if (isNaN(dept)) {
    dept = 0;
    localStorage.setItem("dept", dept.toFixed(2));
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("credits").textContent = credits.toFixed(2);
    document.getElementById("debt").textContent = dept.toFixed(2);
});

Object.defineProperty(window, "raccoon", {
    get: function () {
        this.raccoon = !this.raccoon;
        console.log(this._raccoonState ? "ON" : "OFF");
        return this._raccoonState;
    },
    set: function (val) {
        this._raccoonState = Boolean(val);
    }
});

window.raccoon = false;

function payLoanAutomatically(winnings) {
    if (dept > 0) {
        const payment = Math.min(winnings * 0.5, dept);
        dept -= payment;
        winnings -= payment;

        localStorage.setItem("dept", dept);

        document.getElementById("debt").textContent = dept.toFixed(2);
    }

    return winnings; 
}

function updateCreditsDisplay() {
    document.getElementById("credits").textContent = credits.toFixed(2);
    document.getElementById("debt").textContent = dept.toFixed(2);
}

function updateCredits(amount) {
    credits += amount;
    credits = parseFloat(credits.toFixed(2)); 
    localStorage.setItem("credits", credits.toFixed(2)); 
    const decimalPlaces = parseInt(localStorage.getItem("decimalPlaces"), 10) || 2;
    document.getElementById("credits").textContent = credits.toFixed(decimalPlaces);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedCredits = localStorage.getItem("credits");
    if (savedCredits !== null) {
        credits = parseFloat(savedCredits);
    }

    updateCreditsDisplay();
});


function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("collapsed");
}
