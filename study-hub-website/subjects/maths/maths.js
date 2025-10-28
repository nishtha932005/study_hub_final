// Function to switch between different tabs (CET Lectures, Board Lectures, etc.)
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.style.display = 'none'); // Hide all tabs
  document.getElementById(tabId).style.display = 'block'; // Show the selected tab
}

// Add click event to videos for expanding them
const videos = document.querySelectorAll('.chapter video');

videos.forEach(video => {
  video.addEventListener('click', () => {
    // Toggle the 'expanded' class on the clicked video to make it expand
    video.classList.toggle('expanded');
  });
});

// Function to remember the active tab using localStorage
window.onload = () => {
  const activeTab = localStorage.getItem('activeTab');
  if (activeTab) {
    showTab(activeTab); // Show the saved active tab
  } else {
    showTab('cetLectures'); // Default to CET Lectures if no tab is saved
  }
};

// Save the active tab to localStorage whenever the user switches tabs
const tabNavItems = document.querySelectorAll('.tab-nav li');
tabNavItems.forEach(item => {
  item.addEventListener('click', () => {
    const selectedTab = item.textContent.trim().toLowerCase().replace(' ', '') + 'Lectures';
    localStorage.setItem('activeTab', selectedTab); // Save the active tab
  });
});

// Pomodoro Timer Functionality
let timer;
let minutes = 25;
let seconds = 0;
let isTimerRunning = false;

const timerDisplay = document.getElementById('timer');

function updateTimerDisplay() {
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
  if (isTimerRunning) return; // Prevent starting another timer if one is already running
  isTimerRunning = true;

  timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(timer);
        isTimerRunning = false;
        alert("Time's up! Take a break.");
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    updateTimerDisplay();
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  isTimerRunning = false;
  minutes = 25;
  seconds = 0;
  updateTimerDisplay();
}

document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('resetTimer').addEventListener('click', resetTimer);

// Initialize timer display
updateTimerDisplay();
