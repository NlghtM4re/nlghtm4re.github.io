function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  if (isMobile()) {
    if (confirm("This website may not work properly on mobile devices. Do you want to continue?")) {
      
    } else {
      window.location.href = "https://www.google.com";
    }
  }