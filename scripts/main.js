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

    const sidebar = document.querySelector(".sidebar");

    const sidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    sidebar.classList.toggle("collapsed", sidebarCollapsed);
});

let _raccoonState = false;

Object.defineProperty(window, "raccoon", {
    get: function () {
        _raccoonState = !_raccoonState;
        console.log(_raccoonState ? "ON" : "OFF");
        return _raccoonState;
    },
    set: function (val) {
        _raccoonState = Boolean(val);
    },
    configurable: true
});

 window.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile) {
          document.querySelector(".sidebar").classList.toggle("collapsed");
    } else {

    }
});


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
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapsed");
    localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
}

