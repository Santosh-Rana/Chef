// ========== Cooking App - Main JavaScript ==========

// ========== Firebase Configuration ==========
const firebaseConfig = {
  apiKey: "AIzaSyBJA41pJntF1m0cAkJ3lRHQ5Qm-mYNEUyc",
  authDomain: "ai-cook-7907d.firebaseapp.com",
  projectId: "ai-cook-7907d",
  storageBucket: "ai-cook-7907d.firebasestorage.app",
  messagingSenderId: "848684033447",
  appId: "1:848684033447:web:c7957edc8708537bfec282"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ========== DOM Elements ==========
const authScreen = document.getElementById('auth-screen');
const appSkeletonLoader = document.getElementById('app-skeleton-loader');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const loadingOverlay = document.getElementById('loading-overlay');
const snackbar = document.getElementById('snackbar');
const snackbarMessage = document.getElementById('snackbar-message');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const avatarUpload = document.getElementById('avatar-upload');
const editProfileBtn = document.getElementById('edit-profile-btn');

// Flag to track if the app has been initialized once
let appInitialized = false;

// ========== Utility Functions ==========
function showLoading() {
  loadingOverlay.classList.add('show');
}

function hideLoading() {
  loadingOverlay.classList.remove('show');
}

function showSnackbar(message, duration = 3000) {
  snackbarMessage.textContent = message;
  snackbar.classList.add('show');
  setTimeout(() => {
    snackbar.classList.remove('show');
  }, duration);
}

function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password is too weak',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Check your connection'
  };
  return errorMessages[errorCode] || 'An error occurred. Please try again';
}

// ========== Auth Form Switching ==========
document.getElementById('show-signup-btn').addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
  forgotPasswordForm.style.display = 'none';
});

document.getElementById('show-login-btn').addEventListener('click', () => {
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  forgotPasswordForm.style.display = 'none';
});

document.getElementById('forgot-password-link').addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'none';
  forgotPasswordForm.style.display = 'block';
});

document.getElementById('back-to-login-btn').addEventListener('click', () => {
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  forgotPasswordForm.style.display = 'none';
});

// ========== Sign In ==========
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  if (!email || !password) {
    showSnackbar('Please fill in all fields');
    return;
  }
  
  showLoading();
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    hideLoading();
    showSnackbar(getErrorMessage(error.code));
  }
});

// ========== Sign Up ==========
document.getElementById('signup-btn').addEventListener('click', async () => {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  if (!name || !email || !password) {
    showSnackbar('Please fill in all fields');
    return;
  }
  
  if (password.length < 6) {
    showSnackbar('Password must be at least 6 characters');
    return;
  }
  
  showLoading();
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({
      displayName: name
    });
    showSnackbar('Account created successfully! 🎉');
  } catch (error) {
    hideLoading();
    showSnackbar(getErrorMessage(error.code));
  }
});

// ========== Google Sign In ==========
const googleSignIn = async () => {
  showLoading();
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await auth.signInWithPopup(provider);
  } catch (error) {
    hideLoading();
    if (error.code !== 'auth/popup-closed-by-user') {
      showSnackbar(getErrorMessage(error.code));
    }
  }
};

document.getElementById('google-login-btn').addEventListener('click', googleSignIn);
document.getElementById('google-signup-btn').addEventListener('click', googleSignIn);

// ========== Log Out ==========
document.getElementById('logout-btn').addEventListener('click', async () => {
  showLoading();
  try {
    await auth.signOut();
    // Reset app state
    appInitialized = false;
    // Reload page to clear AI state cleanly
    window.location.reload();
  } catch (error) {
    hideLoading();
    showSnackbar('Error logging out');
  }
});

// ========== Auth State Observer (WITH SKELETON LOADING LOGIC) ==========
auth.onAuthStateChanged((user) => {
  hideLoading();
  
  if (user) {
    // If user is logged in
    authScreen.style.display = 'none';
    
    // Only run the skeleton loader if this is the first load
    if (!appInitialized) {
        // Show Skeleton Loader
        appSkeletonLoader.style.display = 'flex';
        
        // Wait 3 seconds for "Preparing Kitchen" simulation
        // This gives time for DOM to settle and scripts to parse
        setTimeout(() => {
            appSkeletonLoader.style.display = 'none';
            mainApp.style.display = 'flex';
            showSnackbar('Welcome back! 🎉');
            appInitialized = true;
        }, 3000); // 3 Seconds load time
    } else {
        mainApp.style.display = 'flex';
    }
    
    // Update Profile Info
    userName.textContent = user.displayName || 'User';
    userEmail.textContent = user.email;
    
    if (user.photoURL) {
      userAvatar.innerHTML = `<img src="${user.photoURL}" alt="Profile">`;
    } else {
      const initial = (user.displayName || user.email).charAt(0).toUpperCase();
      userAvatar.innerHTML = `<span style="font-size: 60px; font-weight: 700; color: var(--primary-color);">${initial}</span>`;
    }
  } else {
    // User logged out
    authScreen.style.display = 'flex';
    mainApp.style.display = 'none';
    appSkeletonLoader.style.display = 'none';
  }
});

// ========== Navigation (INSTANT SWITCHING) ==========
// ========== Navigation Fix (script.js) ==========

// Purane navItems code ko isse replace karein
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    // Default action rokein
    e.preventDefault();
    e.stopPropagation(); // Event bubble na ho

    // Sahi target element dhundhein (button itself)
    const targetButton = e.target.closest('.nav-item');
    
    if (!targetButton) return; // Agar button nahi mila to ruk jao

    const targetPage = targetButton.getAttribute('data-page');
    
    // 1. Update UI (Active Class)
    navItems.forEach(nav => nav.classList.remove('active'));
    targetButton.classList.add('active');
    
    // 2. Show Target Page
    pages.forEach(page => {
      page.classList.remove('active');
      page.style.display = 'none'; // Ensure hidden pages don't take space
    });
    
    const targetEl = document.getElementById(`${targetPage}-page`);
    if (targetEl) {
        targetEl.classList.add('active');
        targetEl.style.display = 'block';
    }
    
    // 3. Scroll top
    window.scrollTo(0, 0);
  });
});

// Function to switch to AI page from Home
window.switchToAI = function() {
  const aiNavItem = document.querySelector('[data-page="ai"]');
  if (aiNavItem) aiNavItem.click();
};

// ========== Theme Management ==========
const themeCards = document.querySelectorAll('.theme-card');
const body = document.body;
const savedTheme = localStorage.getItem('appTheme') || 'light';
applyTheme(savedTheme);

themeCards.forEach(card => {
  card.addEventListener('click', () => {
    const theme = card.getAttribute('data-theme');
    applyTheme(theme);
    localStorage.setItem('appTheme', theme);
    showSnackbar(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied! 🎨`);
  });
});

function applyTheme(theme) {
  body.classList.remove('light-theme', 'dark-theme', 'ocean-theme', 'forest-theme', 'sunset-theme');
  if (theme !== 'light') {
    body.classList.add(`${theme}-theme`);
  }
  themeCards.forEach(card => {
    card.classList.remove('active');
    if (card.getAttribute('data-theme') === theme) {
      card.classList.add('active');
    }
  });
}

// ========== Enter Key Support ==========
document.addEventListener('DOMContentLoaded', () => {
  const authInputs = document.querySelectorAll('.input-group input');
  authInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const form = input.closest('.auth-form');
        if (form.id === 'login-form') {
          document.getElementById('login-btn').click();
        } else if (form.id === 'signup-form') {
          document.getElementById('signup-btn').click();
        } else if (form.id === 'forgot-password-form') {
          document.getElementById('reset-password-btn').click();
        }
      }
    });
  });
});
// script.js ke end mein ya auth state ke baad add karein

avatarUpload.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  // 1. UI par turant dikhane ke liye (Preview)
  const reader = new FileReader();
  reader.onload = function(event) {
    userAvatar.innerHTML = `<img src="${event.target.result}" alt="Profile" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    
    // 2. Image ko LocalStorage mein save karna (Permanent fix bina server ke)
    localStorage.setItem('user_profile_img', event.target.result);
    showSnackbar("Profile picture updated! 📸");
  };
  reader.readAsDataURL(file);
});

// Auth state check mein ye add karein taaki refresh ke baad bhi image rahe
auth.onAuthStateChanged((user) => {
  if (user) {
    const savedImg = localStorage.getItem('user_profile_img');
    if (savedImg) {
      userAvatar.innerHTML = `<img src="${savedImg}" alt="Profile" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else if (user.photoURL) {
      userAvatar.innerHTML = `<img src="${user.photoURL}" alt="Profile">`;
    }
    // ... baaki ka code
  }
});
