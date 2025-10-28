if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

let timerInterval = null;
const FOCUS_TIME = 25 * 60 * 1000; // 25 minutes in ms
const SHORT_BREAK = 5 * 60 * 1000; // 5 minutes
const LONG_BREAK = 15 * 60 * 1000; // 15 minutes
const CYCLES_BEFORE_LONG_BREAK = 4;

let cycles = parseInt(localStorage.getItem('pomodoroCycles')) || 0;

let endTime = null;      // Timestamp when current timer ends
let mode = null;         // 'focus' or 'break'
let isPaused = false;
let remainingTime = 0;   // Remaining ms when paused

function playSound(type) {
  const audio = new Audio(type === 'focus' ? 'sounds/focus_bell.mp3' : 'sounds/break_bell.mp3');
  audio.play();
}

function notifyUser(message) {
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") new Notification(message);
    });
  }
}

function saveTimer(end, currentMode) {
  sessionStorage.setItem('pomodoroEnd', end);
  sessionStorage.setItem('pomodoroMode', currentMode);
  localStorage.setItem('pomodoroCycles', cycles);
}

function clearTimer() {
  sessionStorage.removeItem('pomodoroEnd');
  sessionStorage.removeItem('pomodoroMode');
}

function updateDisplay(msLeft) {
  const timerDisplay = document.getElementById('timer');
  if (!timerDisplay) return;

  const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer(durationMs, newMode) {
  clearInterval(timerInterval);

  mode = newMode;
  endTime = Date.now() + durationMs;
  isPaused = false;

  saveTimer(endTime, mode);

  updateTimer(); // immediate update

  timerInterval = setInterval(() => {
    if (isPaused) return;
    updateTimer();
  }, 1000);
}

function updateTimer() {
  if (!endTime) return;

  const msLeft = endTime - Date.now();

  if (msLeft <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    clearTimer();

    if (mode === 'focus') {
      cycles++;
      localStorage.setItem('pomodoroCycles', cycles);

      notifyUser("Focus time's up! Take a break.");
      playSound('break');

      if (cycles % CYCLES_BEFORE_LONG_BREAK === 0) {
        startTimer(LONG_BREAK, 'break');
      } else {
        startTimer(SHORT_BREAK, 'break');
      }
    } else if (mode === 'break') {
      notifyUser("Break's over! Back to focus.");
      playSound('focus');
      startTimer(FOCUS_TIME, 'focus');
    }
  } else {
    updateDisplay(msLeft);
  }
}

function pauseTimer() {
  if (!timerInterval || isPaused) return;
  isPaused = true;
  remainingTime = endTime - Date.now();
  console.log("Timer paused with", remainingTime, "ms left");
  saveTimer(Date.now() + remainingTime, mode);
}

function resumeTimer() {
  if (!timerInterval || !isPaused) return;
  isPaused = false;
  endTime = Date.now() + remainingTime;
  console.log("Timer resumed with", remainingTime, "ms left");
  saveTimer(endTime, mode);
}

function initPomodoro() {
  const savedEnd = parseInt(sessionStorage.getItem('pomodoroEnd'));
  const savedMode = sessionStorage.getItem('pomodoroMode');

  if (savedEnd && savedMode) {
    const msLeft = savedEnd - Date.now();
    if (msLeft > 0) {
      cycles = parseInt(localStorage.getItem('pomodoroCycles')) || 0;
      startTimer(msLeft, savedMode);
    } else {
      // Timer expired but page wasn't refreshed immediately — start next phase
      if (savedMode === 'focus') {
        cycles++;
        localStorage.setItem('pomodoroCycles', cycles);
        notifyUser("Focus time's up! Take a break.");
        playSound('break');
        if (cycles % CYCLES_BEFORE_LONG_BREAK === 0) {
          startTimer(LONG_BREAK, 'break');
        } else {
          startTimer(SHORT_BREAK, 'break');
        }
      } else {
        notifyUser("Break's over! Back to focus.");
        playSound('focus');
        startTimer(FOCUS_TIME, 'focus');
      }
    }
  } else {
    cycles = 0;
    startTimer(FOCUS_TIME, 'focus');
  }
}

function resetPomodoro() {
  clearInterval(timerInterval);
  timerInterval = null;
  sessionStorage.removeItem('pomodoroEnd');
  sessionStorage.removeItem('pomodoroMode');
  localStorage.removeItem('pomodoroCycles');
  cycles = 0;
  updateDisplay(FOCUS_TIME);
}

// Pause timer when tab hidden, resume when visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseTimer();
  } else {
    resumeTimer();
  }
});

window.onload = () => {
  initPomodoro();

  const startBtn = document.getElementById('startTimer');
  const resetBtn = document.getElementById('resetTimer');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const currentMode = sessionStorage.getItem('pomodoroMode') || 'focus';
      startTimer(currentMode === 'focus' ? FOCUS_TIME : SHORT_BREAK, currentMode);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', resetPomodoro);
  }
};
