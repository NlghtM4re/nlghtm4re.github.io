//**************ADMIN************************//
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = form.elements['username'].value;
  const password = form.elements['password'].value;

  // ******************* if you see this you are not smart*********************

  if (username === 'username' && password === '1234') {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = 'Correct! Do you want to continue?';
    const continueButton = document.createElement('button');
    continueButton.classList.add('continue');
    continueButton.textContent = 'Continue';
    continueButton.addEventListener('click', () => {
      window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley';
    });
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(popup);
      document.body.removeChild(overlay);
    });
    popup.appendChild(continueButton);
    popup.appendChild(cancelButton);
    document.body.appendChild(popup);
  } else {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = 'Incorrect username or password. Please try again.';
    document.body.appendChild(popup);
    // Close the popup and overlay when clicked outside
    overlay.addEventListener('click', () => {
      document.body.removeChild(popup);
      document.body.removeChild(overlay);
    });
  }
});


//**************************MAIL*********************************//

(function() {
    emailjs.init("CPJ1qfZJMChW-jR7t");
})();

document.getElementById("email-form").addEventListener("submit", function(event) {
    event.preventDefault();

    emailjs.sendForm("service_g7du887", "template_ygkmpyl", this)
        .then(function() {
            alert("Email sent successfully!");
        }, function(error) {
            alert("Failed to send email: " + JSON.stringify(error));
        });
});