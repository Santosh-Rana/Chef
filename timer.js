// ========== Cooking Timer Module ==========

let timerInterval = null;
let remainingSeconds = 0;
let totalSeconds = 0;
let isTimerRunning = false;

// Timer display elements
const timerDisplay = document.getElementById('timer-display');
const timerProgress = document.getElementById('timer-progress');
const startBtn = document.getElementById('start-timer-btn');
const pauseBtn = document.getElementById('pause-timer-btn');
const minutesInput = document.getElementById('timer-minutes');
const secondsInput = document.getElementById('timer-seconds');
const alarmSoundSelect = document.getElementById('alarm-sound-select');

// SVG circle properties for progress animation
const circle = timerProgress;
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

// Initialize circle
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

// ========== Alarm Sound System ==========
const alarmSounds = {
  bell: {
    name: 'Bell',
    frequency: 800,
    duration: 200,
    pattern: [1, 0.5, 1, 0.5, 1]
  },
  chime: {
    name: 'Chime',
    frequency: 1200,
    duration: 150,
    pattern: [1, 0.7, 0.9, 0.5]
  },
  beep: {
    name: 'Beep',
    frequency: 600,
    duration: 100,
    pattern: [1, 1, 1, 1, 1]
  },
  ding: {
    name: 'Ding',
    frequency: 1500,
    duration: 300,
    pattern: [1, 0.8, 0.6]
  },
  buzzer: {
    name: 'Buzzer',
    frequency: 400,
    duration: 500,
    pattern: [1, 0, 1, 0, 1]
  }
};

// Create audio context for alarm
let audioContext = null;

function initAudioContext() {
  if (!audioContext) {
    audioContext = new(window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playAlarmSound(soundType) {
  const ctx = initAudioContext();
  const sound = alarmSounds[soundType] || alarmSounds.bell;
  const pattern = sound.pattern;
  
  let time = ctx.currentTime;
  
  pattern.forEach((volume, index) => {
    if (volume > 0) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = sound.frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, time + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, time + sound.duration / 1000);
      
      oscillator.start(time);
      oscillator.stop(time + sound.duration / 1000);
      
      time += (sound.duration / 1000) + 0.1;
    } else {
      time += 0.15;
    }
  });
  
  // Vibrate if supported
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }
}

// ========== Timer Functions ==========
window.setTimer = function(seconds) {
  totalSeconds = seconds;
  remainingSeconds = seconds;
  updateTimerDisplay();
  updateProgress();
};

function updateTimerDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateProgress() {
  if (totalSeconds === 0) {
    circle.style.strokeDashoffset = circumference;
    return;
  }
  
  const progress = remainingSeconds / totalSeconds;
  const offset = circumference - (progress * circumference);
  circle.style.strokeDashoffset = offset;
  
  // Change color based on remaining time
  if (progress > 0.5) {
    circle.style.stroke = '#4CAF50';
  } else if (progress > 0.2) {
    circle.style.stroke = '#FF9800';
  } else {
    circle.style.stroke = '#F44336';
  }
}

window.startTimer = function() {
  // Get custom time if set
  const customMins = parseInt(minutesInput.value) || 0;
  const customSecs = parseInt(secondsInput.value) || 0;
  
  if (customMins > 0 || customSecs > 0) {
    totalSeconds = (customMins * 60) + customSecs;
    remainingSeconds = totalSeconds;
  }
  
  if (remainingSeconds === 0) {
    showSnackbar('⏰ Please set a timer first!');
    return;
  }
  
  if (isTimerRunning) return;
  
  isTimerRunning = true;
  startBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-flex';
  
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    updateProgress();
    
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      startBtn.style.display = 'inline-flex';
      pauseBtn.style.display = 'none';
      
      // Play alarm
      const selectedSound = alarmSoundSelect.value;
      playAlarmSound(selectedSound);
      
      // Show notification
      showTimerNotification();
      showSnackbar('⏰ Timer completed!');
    }
  }, 1000);
};

window.pauseTimer = function() {
  if (!isTimerRunning) return;
  
  clearInterval(timerInterval);
  isTimerRunning = false;
  startBtn.style.display = 'inline-flex';
  pauseBtn.style.display = 'none';
  startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
};

window.resetTimer = function() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  remainingSeconds = 0;
  totalSeconds = 0;
  
  updateTimerDisplay();
  updateProgress();
  
  startBtn.style.display = 'inline-flex';
  pauseBtn.style.display = 'none';
  startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
  
  minutesInput.value = '';
  secondsInput.value = '';
  
  showSnackbar('Timer reset');
};

// ========== Notification System ==========
function showTimerNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Cooking Timer Complete! ⏰', {
      body: 'Your cooking timer has finished!',
      icon: 'https://em-content.zobj.net/thumbs/120/apple/354/alarm-clock_23f0.png',
      badge: 'https://em-content.zobj.net/thumbs/120/apple/354/cooking_1f373.png'
    });
  }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  setTimeout(() => {
    Notification.requestPermission();
  }, 5000);
}

// ========== Input Validation ==========
minutesInput.addEventListener('input', function() {
  if (this.value < 0) this.value = 0;
  if (this.value > 99) this.value = 99;
});

secondsInput.addEventListener('input', function() {
  if (this.value < 0) this.value = 0;
  if (this.value > 59) this.value = 59;
});

// ========== Timer Presets Quick Access ==========
const presetButtons = document.querySelectorAll('.preset-btn');
presetButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    // Visual feedback
    presetButtons.forEach(b => b.style.transform = 'scale(1)');
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 100);
  });
});

// ========== Keep screen awake during timer ==========
let wakeLock = null;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Screen wake lock activated');
    }
  } catch (err) {
    console.log('Wake lock error:', err);
  }
}

async function releaseWakeLock() {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
    console.log('Screen wake lock released');
  }
}

// Request wake lock when timer starts
const originalStartTimer = window.startTimer;
window.startTimer = function() {
  originalStartTimer();
  if (isTimerRunning) {
    requestWakeLock();
  }
};

// Release wake lock when timer stops
const originalPauseTimer = window.pauseTimer;
window.pauseTimer = function() {
  originalPauseTimer();
  releaseWakeLock();
};

const originalResetTimer = window.resetTimer;
window.resetTimer = function() {
  originalResetTimer();
  releaseWakeLock();
};
