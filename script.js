// ========== Cooking App - Optimized Main Script ==========

// ========== Firebase Configuration (Works in APK) ==========
// ========== Firebase Configuration & Safety Check ==========
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

// 🔴 IMPORTANT: Set persistence to LOCAL (APK के लिए जरूरी)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log("Firebase persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Persistence error:", error);
  });
// ... baaki ka code waisa hi rahega ...
// ========== DOM Elements ==========
const customSplash = document.getElementById('custom-splash');
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

// App initialization flag
let appInitialized = false;
let isEditingName = false;

// ========== Splash Screen Management ==========
window.addEventListener('load', () => {
  // Hide custom splash after 2 seconds
  setTimeout(() => {
    customSplash.classList.add('hide');
    setTimeout(() => {
      customSplash.style.display = 'none';
      authScreen.style.display = 'flex';
    }, 500);
  }, 2000);
});

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

// ========== Password Reset ==========
document.getElementById('reset-password-btn').addEventListener('click', async () => {
  const email = document.getElementById('reset-email').value;
  
  if (!email) {
    showSnackbar('Please enter your email');
    return;
  }
  
  showLoading();
  try {
    await auth.sendPasswordResetEmail(email);
    hideLoading();
    showSnackbar('Password reset email sent! Check your inbox 📧');
    setTimeout(() => {
      document.getElementById('back-to-login-btn').click();
    }, 2000);
  } catch (error) {
    hideLoading();
    showSnackbar(getErrorMessage(error.code));
  }
});

// ========== Sign In ==========
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
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // 🔴 Save login state
    localStorage.setItem('user_logged_in', 'true');
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('user_name', user.displayName || 'User');
    
    // Direct app show
    hideLoading();
    authScreen.style.display = 'none';
    appSkeletonLoader.style.display = 'flex';
    
    setTimeout(() => {
      appSkeletonLoader.style.display = 'none';
      mainApp.style.display = 'flex';
      appInitialized = true;
      
      // Initialize app features
      initializeRecipes();
      loadDailyDishes();
      showSnackbar('Welcome back! 🎉');
    }, 1500);
    
  } catch (error) {
    hideLoading();
    showSnackbar(getErrorMessage(error.code));
  }
});
// ========== Sign Up ==========
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
    
    // 🔴 IMPORTANT: Manual रूप से main app दिखाएं
    hideLoading();
    showSnackbar('Account created successfully! 🎉');
    
    // Directly show main app without waiting for auth state change
    authScreen.style.display = 'none';
    appSkeletonLoader.style.display = 'flex';
    
    setTimeout(() => {
      appSkeletonLoader.style.display = 'none';
      mainApp.style.display = 'flex';
      appInitialized = true;
      
      // Initialize app features
      initializeRecipes();
      loadDailyDishes();
      showSnackbar('Welcome to Chef Master AI! 🎉');
    }, 2000);
    
  } catch (error) {
    hideLoading();
    showSnackbar(getErrorMessage(error.code));
  }
});
// ========== Google Sign In ==========
// ========== Google Sign In ==========
const googleSignIn = async () => {
  showLoading();
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    // 🔴 Save login state
    localStorage.setItem('user_logged_in', 'true');
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('user_name', user.displayName || 'User');
    
    // Direct app show
    hideLoading();
    authScreen.style.display = 'none';
    appSkeletonLoader.style.display = 'flex';
    
    setTimeout(() => {
      appSkeletonLoader.style.display = 'none';
      mainApp.style.display = 'flex';
      appInitialized = true;
      
      // Initialize app features
      initializeRecipes();
      loadDailyDishes();
      showSnackbar('Welcome back! 🎉');
    }, 1500);
    
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
// ========== Log Out ==========
document.getElementById('logout-btn').addEventListener('click', async () => {
  showLoading();
  try {
    await auth.signOut();
    
    // 🔴 Clear all saved data
    localStorage.removeItem('user_logged_in');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    
    appInitialized = false;
    
    // Reset to auth screen
    mainApp.style.display = 'none';
    authScreen.style.display = 'flex';
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    forgotPasswordForm.style.display = 'none';
    
    // Clear form fields
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    
    hideLoading();
    showSnackbar('Logged out successfully');
    
  } catch (error) {
    hideLoading();
    showSnackbar('Error logging out');
  }
});
// ========== Auth State Observer ==========
// ========== Auth State Observer ==========
auth.onAuthStateChanged((user) => {
  hideLoading();
  
  if (user) {
    console.log("User logged in:", user.email);
    
    // 🔴 Save login state to localStorage for APK
    localStorage.setItem('user_logged_in', 'true');
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('user_name', user.displayName || 'User');
    
    if (!appInitialized) {
      authScreen.style.display = 'none';
      appSkeletonLoader.style.display = 'flex';
      
      setTimeout(() => {
        appSkeletonLoader.style.display = 'none';
        mainApp.style.display = 'flex';
        showSnackbar('Welcome back! 🎉');
        appInitialized = true;
        
        // Initialize app features
        initializeRecipes();
        loadDailyDishes();
      }, 2000);
    } else {
      mainApp.style.display = 'flex';
    }
    
    // Update Profile Info
    userName.textContent = user.displayName || 'User';
    userEmail.textContent = user.email;
    
    // Load saved profile image
    const savedImg = localStorage.getItem('user_profile_img');
    if (savedImg) {
      userAvatar.innerHTML = `<img src="${savedImg}" alt="Profile" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    } else if (user.photoURL) {
      userAvatar.innerHTML = `<img src="${user.photoURL}" alt="Profile">`;
    } else {
      const initial = (user.displayName || user.email).charAt(0).toUpperCase();
      userAvatar.innerHTML = `<span style="font-size: 60px; font-weight: 700; color: var(--primary-color);">${initial}</span>`;
    }
  } else {
    console.log("No user logged in");
    
    // 🔴 Clear saved login state
    localStorage.removeItem('user_logged_in');
    localStorage.removeItem('user_email');
    
    // Only show auth screen if app not initialized
    if (!appInitialized) {
      authScreen.style.display = 'flex';
      mainApp.style.display = 'none';
      appSkeletonLoader.style.display = 'none';
    }
  }
});
// ========== Navigation System ==========
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const targetButton = e.target.closest('.nav-item');
    if (!targetButton) return;

    const targetPage = targetButton.getAttribute('data-page');
    
    // Update active nav
    navItems.forEach(nav => nav.classList.remove('active'));
    targetButton.classList.add('active');
    
    // Show target page with animation
    pages.forEach(page => {
      page.classList.remove('active');
      page.style.display = 'none';
    });
    
    const targetEl = document.getElementById(`${targetPage}-page`);
    if (targetEl) {
      targetEl.style.display = 'block';
      requestAnimationFrame(() => {
        targetEl.classList.add('active');
      });
    }
    
    window.scrollTo(0, 0);
  });
});

// Navigation helper functions
window.switchToAI = function() {
  const aiNavItem = document.querySelector('[data-page="ai"]');
  if (aiNavItem) aiNavItem.click();
};

window.switchToRecipes = function() {
  const recipesNavItem = document.querySelector('[data-page="recipes"]');
  if (recipesNavItem) recipesNavItem.click();
};

window.openTimer = function() {
  const timerNavItem = document.querySelector('[data-page="timer"]');
  if (timerNavItem) timerNavItem.click();
};

// ========== Profile Editing ==========
editProfileBtn.addEventListener('click', function() {
  if (!isEditingName) {
    // Enable editing
    userName.contentEditable = true;
    userName.focus();
    userName.style.border = '2px solid var(--primary-color)';
    userName.style.padding = '8px';
    userName.style.borderRadius = '8px';
    editProfileBtn.innerHTML = '<i class="fas fa-save"></i><span>Save Name</span>';
    isEditingName = true;
  } else {
    // Save changes
    const newName = userName.textContent.trim();
    if (newName && newName !== '') {
      auth.currentUser.updateProfile({
        displayName: newName
      }).then(() => {
        userName.contentEditable = false;
        userName.style.border = 'none';
        userName.style.padding = '0';
        editProfileBtn.innerHTML = '<i class="fas fa-edit"></i><span>Edit Name</span>';
        isEditingName = false;
        showSnackbar('Profile updated successfully! ✅');
      }).catch(() => {
        showSnackbar('Failed to update profile');
      });
    }
  }
});

// ========== Avatar Upload ==========
avatarUpload.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    userAvatar.innerHTML = `<img src="${event.target.result}" alt="Profile" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
    localStorage.setItem('user_profile_img', event.target.result);
    showSnackbar("Profile picture updated! 📸");
  };
  reader.readAsDataURL(file);
});

// ========== Recipe Library Functions ==========
function initializeRecipes() {
  const recipesGrid = document.getElementById('recipes-grid');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('recipe-search');
  
  // Display all recipes
  displayRecipes(recipesDatabase);
  
  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      if (category === 'all') {
        displayRecipes(recipesDatabase);
      } else {
        const filtered = recipesDatabase.filter(r => r.category === category);
        displayRecipes(filtered);
      }
    });
  });
  
  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      const filtered = recipesDatabase.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
      );
      displayRecipes(filtered);
    });
  }
}

function displayRecipes(recipes) {
  const recipesGrid = document.getElementById('recipes-grid');
  
  if (recipes.length === 0) {
    recipesGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No recipes found</p>';
    return;
  }
  
  recipesGrid.innerHTML = recipes.map(recipe => `
    <div class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
      <div class="recipe-image" style="background-image: url('${recipe.image}');">
        <div class="recipe-category">${getCategoryIcon(recipe.category)} ${recipe.category}</div>
      </div>
      <div class="recipe-content">
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
        <div class="recipe-meta">
          <span><i class="fas fa-clock"></i> ${recipe.prepTime}</span>
          <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryIcon(category) {
  const icons = {
    indian: '🌶️',
    chinese: '🥢',
    italian: '🍝',
    western: '🍔'
  };
  return icons[category] || '🍽️';
}

// ========== Recipe Detail Modal ==========
window.showRecipeDetail = function(recipeId) {
  const recipe = recipesDatabase.find(r => r.id === recipeId);
  if (!recipe) return;
  
  const modal = document.getElementById('recipe-detail-modal');
  const detailBody = document.getElementById('recipe-detail-body');
  
  detailBody.innerHTML = `
    <div class="recipe-detail-header">
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="recipe-detail-overlay">
        <h1>${recipe.name}</h1>
        <p>${recipe.description}</p>
      </div>
    </div>
    <div class="recipe-detail-info">
      <div class="info-item">
        <i class="fas fa-clock"></i>
        <span>${recipe.prepTime}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-users"></i>
        <span>${recipe.servings} servings</span>
      </div>
      <div class="info-item">
        <i class="fas fa-signal"></i>
        <span>${recipe.difficulty}</span>
      </div>
    </div>
    <div class="recipe-detail-section">
      <h2><i class="fas fa-list"></i> Ingredients</h2>
      <ul class="ingredients-list">
        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
    <div class="recipe-detail-section">
      <h2><i class="fas fa-fire"></i> Instructions</h2>
      <ol class="instructions-list">
        ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
      </ol>
    </div>
  `;
  
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
};

window.closeRecipeDetail = function() {
  const modal = document.getElementById('recipe-detail-modal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
};

// ========== Daily Dishes Carousel ==========
function loadDailyDishes() {
  const todaysDishes = getTodaysDishes();
  const container = document.getElementById('daily-dishes');
  
  container.innerHTML = todaysDishes.map(dish => `
    <div class="daily-dish-card" onclick="showRecipeDetail(${dish.id})">
      <img src="${dish.image}" alt="${dish.name}">
      <div class="daily-dish-info">
        <h3>${dish.name}</h3>
        <p>${getCategoryIcon(dish.category)} ${dish.category}</p>
      </div>
    </div>
  `).join('');
}

// Category filter from home
window.filterRecipes = function(category) {
  switchToRecipes();
  setTimeout(() => {
    const tab = document.querySelector(`[data-category="${category}"]`);
    if (tab) tab.click();
  }, 300);
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
  body.classList.remove('light-theme', 'dark-theme');
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

// ========== Saved Recipes Display ==========
window.showSavedRecipes = function() {
  const sideDrawer = document.getElementById('side-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  
  // Open drawer
  sideDrawer.classList.add('open');
  drawerOverlay.classList.add('active');
  
  // Load saved recipes
  updateSavedRecipesList();
};

function updateSavedRecipesList() {
  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  const container = document.getElementById('saved-recipes-list');
  
  if (savedRecipes.length === 0) {
    container.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No saved recipes yet</p>';
    return;
  }
  
  container.innerHTML = savedRecipes.map(recipe => `
    <div class="saved-recipe-card">
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="saved-recipe-info">
        <h4>${recipe.name}</h4>
        <button onclick="viewSavedRecipe('${recipe.id}')" class="view-btn">
          <i class="fas fa-eye"></i> View
        </button>
      </div>
    </div>
  `).join('');
}

window.viewSavedRecipe = function(recipeId) {
  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  const recipe = savedRecipes.find(r => r.id === recipeId);
  if (recipe) {
    // Close drawer
    document.getElementById('side-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('active');
    
    // Show recipe in AI chat or detail modal
    showSnackbar(`Opening ${recipe.name}...`);
  }
};
// ========== Check for saved login state ==========
function checkSavedLoginState() {
  const savedLogin = localStorage.getItem('user_logged_in');
  const savedEmail = localStorage.getItem('user_email');
  
  if (savedLogin === 'true' && savedEmail) {
    // Auto-login attempt
    console.log("Auto-login attempt for:", savedEmail);
  }
}

// Window load पर call करें
window.addEventListener('load', () => {
  // Check saved login
  checkSavedLoginState();
  
  // Hide custom splash after 2 seconds
  setTimeout(() => {
    customSplash.classList.add('hide');
    setTimeout(() => {
      customSplash.style.display = 'none';
      
      // Check if user is already logged in
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Directly show main app
        showMainAppDirect(currentUser);
      } else {
        // Show auth screen
        authScreen.style.display = 'flex';
      }
    }, 500);
  }, 2000);
});

// Direct app show function
function showMainAppDirect(user) {
  authScreen.style.display = 'none';
  appSkeletonLoader.style.display = 'flex';
  
  setTimeout(() => {
    appSkeletonLoader.style.display = 'none';
    mainApp.style.display = 'flex';
    appInitialized = true;
    
    // Update profile info
    userName.textContent = user.displayName || 'User';
    userEmail.textContent = user.email;
    
    // Initialize app features
    initializeRecipes();
    loadDailyDishes();
    showSnackbar('Welcome back! 🎉');
  }, 1500);
}
// ========== LIQUID NAVIGATION ENHANCEMENTS ==========

// Add wave effect to bottom nav

// ========== GLASS EFFECT ENHANCEMENTS ==========

// Add glass reflection effect
function addGlassReflection() {
  const bottomNav = document.querySelector('.bottom-nav');
  const reflection = document.createElement('div');
  reflection.className = 'glass-reflection';
  bottomNav.appendChild(reflection);
}

// Add click ripple effect
function addGlassRippleEffect() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Create ripple
      const ripple = document.createElement('span');
      ripple.className = 'glass-ripple';
      
      // Position ripple
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x - size / 2 + 'px';
      ripple.style.top = y - size / 2 + 'px';
      
      // Add ripple color based on theme
      if (document.body.classList.contains('dark-theme')) {
        ripple.style.background = 'radial-gradient(circle, rgba(255,180,160,0.3) 0%, transparent 70%)';
      } else {
        ripple.style.background = 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)';
      }
      
      this.appendChild(ripple);
      
      // Remove after animation
      setTimeout(() => {
        if (ripple.parentNode === this) {
          ripple.remove();
        }
      }, 600);
    });
  });
}

// Add CSS for ripple
const glassRippleCSS = `
.glass-ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: glass-ripple-animation 0.6s ease-out;
  pointer-events: none;
  z-index: 0;
}

@keyframes glass-ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
`;

// Add glass parallax effect on scroll
function addGlassParallax() {
  window.addEventListener('scroll', () => {
    const bottomNav = document.querySelector('.bottom-nav');
    const scrollY = window.scrollY;
    
    // Slight movement for parallax effect
    if (scrollY > 50) {
      bottomNav.style.transform = `translateY(${Math.min(scrollY * 0.05, 10)}px)`;
    } else {
      bottomNav.style.transform = 'translateY(0)';
    }
  });
}

// Initialize all glass effects
function initGlassEffects() {
  addGlassReflection();
  addGlassRippleEffect();
  addGlassParallax();
  
  // Add ripple CSS
  const style = document.createElement('style');
  style.textContent = glassRippleCSS;
  document.head.appendChild(style);
}

// Run on page load
window.addEventListener('DOMContentLoaded', initGlassEffects);
