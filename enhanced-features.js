// ========== Additional Features Script ==========
// Modern Alarm Sound Selector, Theme Switcher, Smooth Drawer, External Links

// ========== MODERN ALARM SELECTOR ==========
document.addEventListener('DOMContentLoaded', function() {
  const alarmSelected = document.getElementById('alarm-selected');
  const alarmOptions = document.getElementById('alarm-options');
  const alarmSelect = document.getElementById('alarm-sound-select');
  const selectedAlarmText = document.getElementById('selected-alarm-text');
  
  if (alarmSelected && alarmOptions) {
    // Toggle dropdown
    alarmSelected.addEventListener('click', function(e) {
      e.stopPropagation();
      alarmOptions.classList.toggle('show');
      alarmSelected.classList.toggle('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!alarmOptions.contains(e.target) && !alarmSelected.contains(e.target)) {
        alarmOptions.classList.remove('show');
        alarmSelected.classList.remove('active');
      }
    });
    
    // Handle option selection
    const options = alarmOptions.querySelectorAll('.alarm-option');
    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Remove selected class from all options
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        this.classList.add('selected');
        
        // Update displayed text
        const name = this.querySelector('.alarm-option-name').textContent;
        selectedAlarmText.textContent = name;
        
        // Update hidden select
        const value = this.getAttribute('data-value');
        if (alarmSelect) {
          alarmSelect.value = value;
        }
        
        // Close dropdown
        alarmOptions.classList.remove('show');
        alarmSelected.classList.remove('active');
        
        // Play preview sound
        if (window.playAlarmSound) {
          setTimeout(() => {
            window.playAlarmSound(value);
          }, 100);
        }
      });
    });
  }
});

// ========== THEME SWITCHER ==========
document.addEventListener('DOMContentLoaded', function() {
  const themeOptions = document.querySelectorAll('.theme-option');
  const body = document.body;
  
  // Load saved theme
  const savedTheme = localStorage.getItem('app-theme') || 'light';
  applyTheme(savedTheme);
  
  function applyTheme(theme) {
    // Remove all theme classes
    body.classList.remove('light-theme', 'dark-theme', 'ocean-theme', 'sunset-theme', 'forest-theme');
    
    // Apply selected theme
    body.classList.add(theme + '-theme');
    
    // Update theme option selection
    themeOptions.forEach(option => {
      option.classList.remove('selected');
      if (option.getAttribute('data-theme') === theme) {
        option.classList.add('selected');
      }
    });
    
    // Save to localStorage
    localStorage.setItem('app-theme', theme);
    
    // Update meta theme color
    const themeColors = {
      light: '#FF6B35',
      dark: '#1a1a1a',
      ocean: '#0077BE',
      sunset: '#FF6B35',
      forest: '#2E7D32'
    };
    
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', themeColors[theme] || '#FF6B35');
    }
  }
  
  // Handle theme selection
  themeOptions.forEach(option => {
    option.addEventListener('click', function() {
      const theme = this.getAttribute('data-theme');
      applyTheme(theme);
      showSnackbar(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`);
    });
  });
});

// ========== THEME COLOR DEFINITIONS ==========
// Add theme-specific CSS variables
const themeStyles = document.createElement('style');
themeStyles.textContent = `
  .light-theme {
    --primary-color: #FF6B35;
    --primary-container: #FFE4DB;
    --on-primary-container: #FF6B35;
    --surface: #FAFAFA;
    --surface-container: #FFFFFF;
    --on-surface: #1C1B1F;
    --on-surface-variant: #666666;
    --outline: #E0E0E0;
    --outline-variant: #F0F0F0;
  }
  
  .dark-theme {
    --primary-color: #FFB4A0;
    --primary-container: #5D3A2E;
    --on-primary-container: #FFB4A0;
    --surface: #1a1a1a;
    --surface-container: #252525;
    --on-surface: #e8e8e8;
    --on-surface-variant: #b8b8b8;
    --outline: #404040;
    --outline-variant: #353535;
  }
  
  .ocean-theme {
    --primary-color: #0077BE;
    --primary-container: #D0EFFF;
    --on-primary-container: #0077BE;
    --surface: #F0F8FF;
    --surface-container: #FFFFFF;
    --on-surface: #001F3F;
    --on-surface-variant: #4A6FA5;
    --outline: #B3D9FF;
    --outline-variant: #E6F3FF;
  }
  
  .sunset-theme {
    --primary-color: #FF6B35;
    --primary-container: #FFE4DB;
    --on-primary-container: #FF6B35;
    --surface: #FFF5F0;
    --surface-container: #FFFFFF;
    --on-surface: #3D1F0A;
    --on-surface-variant: #8B4513;
    --outline: #FFDBC4;
    --outline-variant: #FFF0E6;
  }
  
  .forest-theme {
    --primary-color: #2E7D32;
    --primary-container: #C8E6C9;
    --on-primary-container: #2E7D32;
    --surface: #F1F8F4;
    --surface-container: #FFFFFF;
    --on-surface: #1B5E20;
    --on-surface-variant: #558B2F;
    --outline: #A5D6A7;
    --outline-variant: #E8F5E9;
  }
`;
document.head.appendChild(themeStyles);

// ========== SMOOTH DRAWER FIX (NO BLINK/JITTER) ==========
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menu-btn');
  const sideDrawer = document.getElementById('side-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  
  if (menuBtn && sideDrawer && drawerOverlay) {
    // Open drawer
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      requestAnimationFrame(() => {
        sideDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close drawer
    function closeDrawer() {
      requestAnimationFrame(() => {
        sideDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    drawerOverlay.addEventListener('click', closeDrawer);
    
    // Close drawer when clicking drawer items
    const drawerItems = sideDrawer.querySelectorAll('.drawer-item');
    drawerItems.forEach(item => {
      item.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        if (action) {
          handleDrawerAction(action);
        }
        closeDrawer();
      });
    });
  }
});

// ========== EXTERNAL LINK HANDLER (Force open in browser) ==========
document.addEventListener('DOMContentLoaded', function() {
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  
  externalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const url = this.getAttribute('href');
      
      // For APK: Try to open in external browser
      if (typeof cordova !== 'undefined' && cordova.InAppBrowser) {
        e.preventDefault();
        cordova.InAppBrowser.open(url, '_system');
      } else if (window.open) {
        // For web: Open in new tab
        e.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      // Otherwise let default behavior happen
    });
  });
});

// ========== SAVED RECIPE VIEWER ==========
function viewSavedRecipe(recipeId) {
  // Get recipe from database
  const recipe = recipesDatabase.find(r => r.id === recipeId);
  
  if (!recipe) {
    showSnackbar('Recipe not found');
    return;
  }
  
  // Show recipe detail modal
  showRecipeDetail(recipe);
  
  // Close drawer if open
  const sideDrawer = document.getElementById('side-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  if (sideDrawer) sideDrawer.classList.remove('active');
  if (drawerOverlay) drawerOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Enhanced recipe detail display
function showRecipeDetail(recipe) {
  const modal = document.querySelector('.recipe-detail-modal');
  const content = modal.querySelector('.recipe-detail-content');
  
  if (!modal || !content) return;
  
  // Build beautiful recipe detail HTML
  content.innerHTML = `
    <div class="recipe-detail-header">
      <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500'">
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
        <i class="fas fa-signal"></i>
        <span>${recipe.difficulty}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-users"></i>
        <span>${recipe.servings} servings</span>
      </div>
    </div>
    
    <div class="recipe-detail-section">
      <h2><i class="fas fa-list"></i> Ingredients</h2>
      <ul class="ingredients-list">
        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
    
    <div class="recipe-detail-section">
      <h2><i class="fas fa-clipboard-list"></i> Instructions</h2>
      <ol class="instructions-list">
        ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
      </ol>
    </div>
    
    <div style="height: 40px;"></div>
  `;
  
  // Show modal with animation
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  
  // Handle close button
  const closeBtn = document.querySelector('.close-detail-btn');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    };
  }
  
  // Close on overlay click
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  };
}

// Make function globally available
window.viewSavedRecipe = viewSavedRecipe;

// ========== DRAWER ACTIONS HANDLER ==========
function handleDrawerAction(action) {
  switch(action) {
    case 'new-chat':
      // Clear chat and start new conversation
      if (typeof clearChat === 'function') {
        clearChat();
      }
      showSnackbar('New conversation started');
      break;
      
    case 'clear-all':
      // Clear all chats
      if (confirm('Are you sure you want to clear all chat history?')) {
        if (typeof clearAllChats === 'function') {
          clearAllChats();
        }
        showSnackbar('All chats cleared');
      }
      break;
      
    case 'meal-planner':
      showSnackbar('Meal planner coming soon!');
      break;
      
    case 'grocery-list':
      showSnackbar('Grocery list coming soon!');
      break;
      
    default:
      console.log('Unknown action:', action);
  }
}

// ========== FIX MISSING IMAGES ==========
// Fix for Vada Pav image
document.addEventListener('DOMContentLoaded', function() {
  // Update Vada Pav image URL (Recipe ID 2)
  const vadaPavRecipe = recipesDatabase.find(r => r.id === 2);
  if (vadaPavRecipe) {
    vadaPavRecipe.image = "https://images.unsplash.com/photo-1601050690117-c4aa77c0fe67?w=500";
  }
  
  // Update Risotto image URL (Recipe ID 14)
  const risottoRecipe = recipesDatabase.find(r => r.id === 14);
  if (risottoRecipe) {
    risottoRecipe.image = "https://images.unsplash.com/photo-1595908129746-34d2c1c1e3c1?w=500";
  }
  
  // Reload daily dishes and recipes if they're already loaded
  if (typeof loadDailyDishes === 'function') {
    setTimeout(() => {
      loadDailyDishes();
      if (typeof loadAllRecipes === 'function') {
        loadAllRecipes();
      }
    }, 100);
  }
});

// ========== PERFORMANCE OPTIMIZATIONS ==========
// Debounce function for input events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Optimize scroll performance
document.addEventListener('DOMContentLoaded', function() {
  const scrollContainers = document.querySelectorAll('.daily-dishes-carousel, .saved-recipes-container, .recipe-detail-content');
  
  scrollContainers.forEach(container => {
    if (container) {
      // Use passive event listeners for better scroll performance
      container.addEventListener('touchstart', function() {}, { passive: true });
      container.addEventListener('touchmove', function() {}, { passive: true });
    }
  });
});

// ========== IMAGE LAZY LOADING ==========
document.addEventListener('DOMContentLoaded', function() {
  // Add intersection observer for lazy loading images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// ========== REDUCED MOTION FOR LOW-END DEVICES ==========
// Detect if user prefers reduced motion or if device is low-end
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

if (prefersReducedMotion || isLowEndDevice) {
  // Add class to body to reduce animations
  document.body.classList.add('reduce-motion');
  
  // Add CSS for reduced motion
  const reducedMotionStyles = document.createElement('style');
  reducedMotionStyles.textContent = `
    .reduce-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(reducedMotionStyles);
}

console.log('✅ Additional features loaded: Modern alarm UI, Theme switcher, Smooth drawer, External links, Performance optimizations');
