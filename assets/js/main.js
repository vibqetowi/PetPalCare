/**
 * Template Name: iPortfolio
 * Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
 * Updated: Mar 17 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = document.getElementById(el); // Change this line
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    document.getElementById(el).addEventListener("scroll", listener); // Change this line
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = document.querySelectorAll("#navbar .scrollto"); // Change this line
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = document.getElementById(navbarlink.hash.slice(1)); // Change this line
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll('app-content', navbarlinksActive); // Change this line

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: "smooth",
    });
  };



  /**
   * Mobile nav toggle
   */

document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const toggleButton = document.querySelector('.mobile-nav-toggle');
    const body = document.querySelector('body');

    // Toggle Header Visibility on click event of the toggle button
    toggleButton.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent click from immediately propagating to document
        body.classList.toggle("mobile-nav-active");
        toggleButton.classList.toggle("bi-list");
        toggleButton.classList.toggle("bi-x");
    });

    // Collapse the header when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideHeaderOrToggleButton = header.contains(event.target) || toggleButton.contains(event.target);

        if (!isClickInsideHeaderOrToggleButton && body.classList.contains("mobile-nav-active")) {
            body.classList.remove("mobile-nav-active");
            toggleButton.classList.remove("bi-x");
            toggleButton.classList.add("bi-list");
        }
    });
});



  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let body = document.getElementById('app-content'); // Change this line
        if (body.classList.contains("mobile-nav-active")) {
          body.classList.remove("mobile-nav-active");
          let navbarToggle = document.querySelector(".mobile-nav-toggle"); // Change this line
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select(".typed");
  if (typed) {
    let typed_strings = typed.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }



  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();
})();


// _____________________________________________________________
// My Script 
// _____________________________________________________________

// Function to update the current time displayed on the app.
function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedTime = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
  // Updates the text content of the element with id="current-time" to show the formatted time.
  document.getElementById("current-time").textContent = formattedTime;
}

// Call updateTime immediately to set the initial time, then update it every 30 seconds.
updateTime();
setInterval(updateTime, 30000);

// Asynchronously loads a new screen or section of the app.
async function loadScreen(sectionFile) {
    await displayLoadingAnimation(); // Displays a loading animation.

    // Accessing the startup screen and the main app content container.
    const startupScreen = document.getElementById('app-startup-screen');
    const appContent = document.getElementById('app-content');

    // Removes the startup screen if it exists, allowing the user to interact with the app content.
    if (startupScreen) {
        startupScreen.remove();
    }

    try {
        // Fetches the HTML content for the new screen or section.
        const response = await fetch(`./app-screens/${sectionFile}`);
        const html = await response.text();

        // Parses the fetched HTML to find the title of the new screen.
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const screenTitleDiv = doc.body.querySelector('div[data-screen-title]');

        // If a title is found, it updates the app content with the new screen and logs the navigation.
        if (screenTitleDiv) {
            const screenTitle = screenTitleDiv.getAttribute('data-screen-title');
            appContent.innerHTML = html; // Replaces the content with the new screen's HTML.
            addLog(`Navigated to ${screenTitle}`);
        } else {
            // If no title is found, it still updates the content but logs a warning.
            console.error('No div with data-screen-title attribute found in the section file.');
            appContent.innerHTML = html;
            addLog(`Navigated to section file without a title: ${sectionFile}`);
        }
    } catch (error) {
        // Logs an error if the new screen cannot be loaded.
        console.error('Failed to load the section:', error);
        addLog(`Failed to load section: ${sectionFile}`);
    }
}

// Displays a loading animation while the app loads new content.
async function displayLoadingAnimation() {
    const appContent = document.getElementById('app-content');

    try {
        const response = await fetch(`./app-screens/loading-animation.html`);
        if (!response.ok) {
            throw new Error('Failed to fetch loading animation');
        }
        const loadingHTML = await response.text();
        appContent.innerHTML = loadingHTML; // Inserts the loading animation into the app content.
    } catch (error) {
        console.error('Failed to display loading animation:', error);
        appContent.innerHTML = '<p>Error loading animation...</p>'; // Displays an error message if the animation cannot be loaded.
    }
}

// Resets the app to its initial state, displaying the startup screen.
function resetApp() {
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = ""; // Clears the current app content.

    // Creates and adds the startup screen image back to the app content.
    const startupImg = document.createElement('img');
    startupImg.src = './assets/img/logo-with-text-trans.png';
    startupImg.alt = 'App Logo';
    startupImg.id = 'app-startup-screen';
    startupImg.onclick = () => loadScreen('main-menu.html'); // Reloads the main menu when clicked.

    appContent.appendChild(startupImg);
    addLog("App Reset By User"); // Logs the reset action.
}

// Adds a log entry with a timestamp to the app's log area.
function addLog(message) {
  const logContent = document.getElementById('log-content');
  const now = new Date();
  const timestamp = now.getHours().toString().padStart(2, '0') + ':' +
                    now.getMinutes().toString().padStart(2, '0') + ':' +
                    now.getSeconds().toString().padStart(2, '0');

  // Creates a new log entry with the current timestamp and message.
  const logEntry = `<p><span>${timestamp}</span>: ${message}</p>`;

  // Adds the new log entry to the top of the log content area.
  logContent.innerHTML = logEntry + logContent.innerHTML;
}

// Function to display a temporary notification to the user.
function showNotification(message) {
    // Reference to the container for app notifications.
    let notificationsContainer = document.getElementById('app-notifications-container');

    // Create the notification element with provided message.
    const notification = document.createElement('div');
    notification.className = 'notification card';
    notification.innerHTML = `
<div class="row g-0">
    <div class="col-md-4" style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <img src="./assets/img/logo.png" alt="logo" class="img-fluid rounded-start" style="margin:auto;">
    </div>
    <div class="col-md-8">
        <div class="card-body">
            <h2 class="card-title" style="margin-left: 0; text-align: left;">PetPalCare</h2>
            <p class="card-text">${message}</p>
            <br>
            <p><strong>Swipe to dismiss this notification</strong></p>
        </div>
    </div>
</div>`;
    // Style adjustments for the notification, including initial positioning and animation setup.
    Object.assign(notification.style, {
        width: '95%',
        position: 'absolute',
        top: '-100%',
        left: '2.5%',
        marginTop: '3em',
        border: '0.3em rgb(0, 16, 66) solid',
        borderRadius: '3em',
        transform: 'translateY(-100%)',
        transition: 'transform 0.5s ease-out',
        zIndex: '9999'
    });

    // Add the notification to the container.
    notificationsContainer.appendChild(notification);

    // Slide-in animation for the notification.
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 100);

    // Initialize swipe gesture handling for notification dismissal.
    let mc = new Hammer(notification);
    mc.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    mc.on("panleft panright", function(ev) {
        const direction = ev.type === "panleft" ? '-100%' : '100%';
        notification.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        notification.style.transform = `translateX(${direction})`;
        notification.style.opacity = '0';
        setTimeout(() => notification.parentNode?.removeChild(notification), 500);
    });

    // Automatically remove the notification after a delay.
    setTimeout(() => notification.remove(), 5000);

    // Log the action of triggering a notification.
    addLog(`Triggered Notification: ${message}`);
}

// Function to display a persistent notification that requires user interaction to dismiss.
function showPersistentNotification(message) {
    let notificationsContainer = document.getElementById('app-notifications-container');

    const notification = document.createElement('div');
    notification.className = 'notification card';
    notification.innerHTML = `
<div class="row g-0">
    <div class="col-md-4" style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <img src="./assets/img/logo.png" alt="logo" class="img-fluid rounded-start" style="margin:auto;">
    </div>
    <div class="col-md-8">
        <div class="card-body">
            <h2 class="card-title" style="margin-left: 0; text-align: left;">PetPalCare</h2>
            <p class="card-text">${message}</p>
            <br>
            <p><strong>You must click one of the buttons to dismiss this notification</strong></p>
        </div>
    </div>
</div>`;

    // Style adjustments for the notification, similar to the temporary notification but designed to stay until dismissed by the user.
    Object.assign(notification.style, {
        width: '95%',
        position: 'absolute',
        top: '-100%',
        left: '2.5%',
        marginTop: '3em',
        border: '0.3em rgb(0, 16, 66) solid',
        borderRadius: '3em',
        transform: 'translateY(-100%)',
        transition: 'transform 0.5s ease-out',
        zIndex: '9999'
    });

    notificationsContainer.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 100);

    // Log the action of triggering a persistent notification.
    addLog(`Triggered Persistent Notification`);
}

// Function to clear all persistent notifications.
function removePersistentNotification() {
    let notificationsContainer = document.getElementById('app-notifications-container');
    notificationsContainer.innerHTML = ""; // Clears the container of all child elements.
}

// Prevent default scrolling behavior under certain conditions in the app content area.
document.getElementById('app-content').addEventListener('wheel', function(e) {
    const container = this;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const height = container.clientHeight;
    const delta = e.deltaY;
    const up = delta < 0;

    let atBottom = scrollTop + height >= scrollHeight;

    // Prevent scrolling up at the top of the container.
    if (up && scrollTop <= 0) {
        e.preventDefault();
    }
    // Prevent scrolling down at the bottom of the container.
    if (!up && atBottom) {
        e.preventDefault();
    }
});

// Simulates submitting a booking request.
async function submitBooking() {
    await displayLoadingAnimation(); // Displays a loading animation while processing.
    setTimeout(() => {
        loadScreen('booking2.html'); // Loads the next step in the booking process after a delay.
    }, 2000); // Simulates a network request delay.
    addLog("Info: Nothing was submitted, that's not implemented"); // Logs that the submission functionality is not implemented.
}

function tipUtility(selectedRating) {
    const leaveTip = document.getElementById('leave-tip');
    const fiveStarBtn = document.getElementById('fiveStarBtn');
    const otherRatingBtn = document.getElementById('otherRatingBtn');

if (selectedRating === 'fiveStar') {
    leaveTip.style.display = 'block';
    fiveStarBtn.classList.add("selected");
    fiveStarBtn.classList.remove("not-selected");
    otherRatingBtn.classList.remove("selected");
    otherRatingBtn.classList.add("not-selected");
} else if (selectedRating === 'other') {
    leaveTip.style.display = 'none';
    otherRatingBtn.classList.add("selected");
    otherRatingBtn.classList.remove("not-selected");
    fiveStarBtn.classList.remove("selected");
    fiveStarBtn.classList.add("not-selected");
} else {
    leaveTip.style.display = 'none';
    fiveStarBtn.classList.remove("selected");
    fiveStarBtn.classList.add("not-selected");
    otherRatingBtn.classList.remove("selected");
    otherRatingBtn.classList.add("not-selected");
}

// Get the input element and the error message element
const tipInput = document.getElementById('tip-input');
const tipError = document.getElementById('tip-error');

// Function to check if the input is a valid number
function validateTip() {
    // Get the input value
    const tipValue = tipInput.value.trim();

    // Check if the input value is a valid number
    if (isNaN(tipValue)) {
        // Display the error message
        tipError.style.display = 'block';
    } else {
        // Hide the error message if the input is valid
        tipError.style.display = 'none';
    }
}

// Add an event listener to the input to trigger validation on input change
tipInput.addEventListener('input', validateTip);


}

