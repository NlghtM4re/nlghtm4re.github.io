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


function payLoanAutomatically(profit) {
    // profit is only the money above the bet
    if (debt > 0 && profit > 0) {
        const payment = Math.min(profit * 0.5, debt);  // max 50 % of profit, never more than debt
        debt  -= payment;
        profit -= payment;  // remove what was just used to pay debt

        // persist + display debt
        localStorage.setItem("debt", debt.toFixed(2));
        document.getElementById("debt").textContent = debt.toFixed(2);
    }
    return profit;  // whatever’s left is real profit
}

function payDept(amount) {
    if (amount < dept) {
        dept -= amount;
        localStorage.setItem("dept", dept.toFixed(2));
        document.getElementById("debt").textContent = dept.toFixed(2);
    }

    return dept;
}

function updateCreditsDisplay() {
    document.getElementById("credits").textContent = credits.toFixed(2);
    document.getElementById("debt").textContent = dept.toFixed(2);
}

function updateCredits(amount) {
    credits += amount;
    credits = parseFloat(credits.toFixed(2)); 
    localStorage.setItem("credits", credits.toFixed(2)); 
    document.getElementById("credits").textContent = credits.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedCredits = localStorage.getItem("credits");
    if (savedCredits !== null) {
        credits = parseFloat(savedCredits);
    }

    updateCreditsDisplay();
});

document.addEventListener("DOMContentLoaded", () => {
    const sidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    const html = document.documentElement;
    if (sidebarCollapsed) {
        html.classList.add("sidebar-collapsed");
    } else {
        html.classList.remove("sidebar-collapsed");
    }
});



function toggleSidebar() {
    const html = document.documentElement;
    html.classList.toggle("sidebar-collapsed");
    localStorage.setItem("sidebarCollapsed", html.classList.contains("sidebar-collapsed"));
}




