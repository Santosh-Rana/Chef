// ========== ChefMaster AI - Enhanced Professional Kitchen Companion ==========
// Material 3 Design with Advanced Features

// Load marked.js library for markdown rendering
const markedScript = document.createElement('script');
markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
document.head.appendChild(markedScript);

// ========== DOM Elements ==========
const openChatBtn = document.querySelector("#open-chat-btn");
const closeChatBtn = document.querySelector("#close-modal-btn");
const chatModal = document.querySelector("#chat-modal");
const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");
const menuBtn = document.querySelector("#menu-btn");
const sideDrawer = document.querySelector("#side-drawer");
const drawerOverlay = document.querySelector("#drawer-overlay");
const welcomeScreen = document.querySelector(".welcome-screen");
const translateBtn = document.querySelector("#translate-btn");
const languageModal = document.querySelector("#language-modal");
const closeLanguageModal = document.querySelector("#close-language-modal");
const activeFiltersDiv = document.querySelector(".active-filters");
const filterChipsDiv = document.querySelector("#filter-chips");
const voiceInputBtn = document.querySelector("#voice-input-btn");

// ========== API Configuration ==========
const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "deepseek/deepseek-chat";

// ========== State Management ==========
let controller, typingInterval;
let currentLanguage = localStorage.getItem("chefLanguage") || "hinglish";
let activeFilters = [];
let currentCategory = null;
let servingSize = parseInt(localStorage.getItem("servingSize")) || 4;
let uploadedImage = null;
let uploadedImageName = "";
let uploadedImageSize = "";
let savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
let isRecording = false;
let recognition = null;

// ========== Multilingual System Prompts ==========
const systemPrompts = {
  en: `You are ChefMaster AI, a world-renowned, passionate professional chef.
Your goal is to help users cook delicious meals.
When asked for a recipe:
1. Start with an encouraging, appetizing description.
2. Provide a clearly formatted "Ingredients" list using bullet points with food emojis (e.g., 🧅 Onion, 🧂 Salt, 🥩 Beef).
3. Provide "Instructions" in clear, numbered steps.
4. Keep the tone warm, professional, and encouraging.
5. Format using markdown (bold key terms with **).

IMPORTANT: Use COLORFUL emojis and food icons throughout your responses to make them visually appealing (🍅🥕🧅🧄🌶️🥔🍆🥬🥦🌽🍄🥜🌰🍞🥖🥐🧀🥚🍖🥩🍗🐟🦐🍤🥘🍲🥗🍛🍜🍝🍕🌮🌯🥙🍳🥞🧇🥓).

CRITICAL DIETARY RESTRICTIONS:
- If the user has specified dietary filters (vegetarian, vegan, gluten-free, keto), you MUST STRICTLY follow them.
- VEGETARIAN: NO meat, poultry, fish, or seafood. Eggs and dairy are allowed.
- VEGAN: NO animal products whatsoever (no meat, fish, eggs, dairy, honey).
- GLUTEN-FREE: NO wheat, barley, rye, or any gluten-containing ingredients.
- KETO: High fat, very low carb (under 20g net carbs per serving).

SERVING SIZE: Always scale ingredients for the specified number of servings. Clearly indicate serving size at the start with format "👥 Serves: X people".

Always respond in English only.`,

  hi: `आप ChefMaster AI हैं, एक विश्व प्रसिद्ध, passionate professional chef।
आपका लक्ष्य users को स्वादिष्ट भोजन बनाने में मदद करना है।
जब recipe मांगी जाए:
1. एक encouraging, appetizing description से शुरू करें।
2. Food emojis के साथ "सामग्री" list दें (जैसे, 🧅 प्याज, 🧂 नमक, 🥩 मांस)।
3. Clear, numbered steps में "निर्देश" दें।
4. Tone warm, professional, और encouraging रखें।
5. Markdown formatting use करें (bold key terms **से**)।

महत्वपूर्ण: अपने उत्तरों में COLORFUL emojis और food icons का उपयोग करें (🍅🥕🧅🧄🌶️🥔🍆🥬🥦🌽🍄🥜🌰🍞🥖🥐🧀🥚🍖🥩🍗🐟🦐🍤🥘🍲🥗🍛🍜🍝🍕🌮🌯🥙🍳🥞🧇🥓)।

महत्वपूर्ण आहार प्रतिबंध:
- यदि user ने dietary filters specify किए हैं (शाकाहारी, शुद्ध शाकाहारी, gluten-free, keto), तो आपको STRICTLY उनका पालन करना होगा।
- शाकाहारी (VEGETARIAN): कोई मांस, मुर्गी, मछली, या seafood नहीं। अंडे और dairy allowed हैं।
- शुद्ध शाकाहारी (VEGAN): कोई भी पशु उत्पाद नहीं (मांस, मछली, अंडे, dairy, शहद नहीं)।
- GLUTEN-FREE: गेहूं, जौ, राई, या कोई gluten युक्त सामग्री नहीं।
- KETO: High fat, बहुत कम carb (प्रति serving 20g net carbs से कम)।

SERVING SIZE: हमेशा specified संख्या के लिए ingredients को scale करें। शुरुआत में serving size स्पष्ट रूप से "👥 परोसता है: X लोग" format में बताएं।

हमेशा केवल हिंदी में जवाब दें।`,

  hinglish: `Aap ChefMaster AI hain, ek world-renowned, passionate professional chef AURO Indian Bhoj/Party Planning Expert.
Aapka goal hai users ko delicious meals banana sikhana aur Indian parties/bhoj plan karne mein madad karna.

Jab recipe maangi jaye:
1. Encouraging, appetizing description se start karo.
2. Food emojis ke saath "Ingredients" list do (e.g., 🧅 Pyaaz, 🧂 Namak, 🥩 Meat).
3. Clear, numbered steps mein "Instructions" do.
4. Tone warm, professional, aur encouraging rakho.
5. Markdown formatting use karo (bold key terms **se**).

INDIAN PARTY/BHOJ PLANNING EXPERTISE:
Jab user party, bhoj, shaadi ka khana, ya kisi event ke liye puchhe, toh aap ek INTELLIGENT PARTY PLANNER ki tarah behave karo:

1. **Step-by-step questions pucho**:
   - "Kis tarah ki party hai? (Birthday, Wedding, Anniversary, Pooja, Village Bhoj, etc.)"
   - "Kitne log honge? (Approximate guest count)"
   - "Kya preference hai? (Veg/Non-veg/Mix)"
   - "Budget kya hai? (Approximate per person)"
   - "Kis state/region ka style chahiye? (North Indian, South Indian, Bengali, Punjabi, Village-style, etc.)"

2. **Complete planning provide karo**:
   - Complete menu with starters, main course, desserts, beverages
   - Exact quantities for all dishes
   - Shopping list with current market prices (January 2026 India rates)
   - Total estimated cost breakdown
   - Cooking timeline and sequence
   - Serving suggestions
   - Traditional village-style bhoj tips agar request ho

3. **Regional expertise**:
   - North Indian: Rajasthani Bhoj, Punjabi Party, UP/Bihar style
   - South Indian: Tamil, Kerala, Andhra style feasts
   - East Indian: Bengali Bhoj, Odia celebrations
   - West Indian: Gujarati, Marathi, Goan parties
   - Village-style traditional bhojs with authentic touches

4. **Budget calculations (January 2026 India prices)**:
   - Vegetables: ₹40-80/kg
   - Rice: ₹50-70/kg
   - Dal: ₹100-150/kg
   - Chicken: ₹180-220/kg
   - Paneer: ₹300-400/kg
   - Spices, oil, ghee accordingly
   - Include all costs realistically

IMPORTANT: Apne responses mein COLORFUL emojis aur food icons ka bahut use karo (🍅🥕🧅🧄🌶️🥔🍆🥬🥦🌽🍄🥜🌰🍞🥖🥐🧀🥚🍖🥩🍗🐟🦐🍤🥘🍲🥗🍛🍜🍝🍕🌮🌯🥙🍳🥞🧇🥓)।

CRITICAL DIETARY RESTRICTIONS:
- Agar user ne dietary filters specify kiye hain (vegetarian, vegan, gluten-free, keto), toh aapko STRICTLY unhe follow karna HOGA.
- VEGETARIAN: Koi bhi meat, chicken, fish, ya seafood NAHI. Eggs aur dairy allowed hain.
- VEGAN: Koi bhi animal product bilkul NAHI (meat, fish, eggs, dairy, honey kuch nahi).
- GLUTEN-FREE: Gehun, barley, rye, ya koi gluten wali cheez NAHI.
- KETO: High fat, bahut kam carb (har serving mein 20g net carbs se kam).

SERVING SIZE: Hamesha specified number ke liye ingredients ko scale karo. Shuruat mein serving size clearly "👥 Serves: X log" format mein batao.

Hamesha Hinglish (Hindi-English mix) mein jawab do. Natural mix rakho jaise log baat karte hain.`,

  es: `Eres ChefMaster AI, un chef profesional apasionado de renombre mundial.
Tu objetivo es ayudar a los usuarios a cocinar comidas deliciosas.
Cuando te pidan una receta:
1. Comienza con una descripción alentadora y apetitosa.
2. Proporciona una lista de "Ingredientes" claramente formateada con emojis de comida (ej., 🧅 Cebolla, 🧂 Sal, 🥩 Carne).
3. Proporciona "Instrucciones" en pasos numerados claros.
4. Mantén un tono cálido, profesional y alentador.
5. Usa formato markdown (resalta términos clave con **).

IMPORTANTE: Usa emojis COLORIDOS e íconos de comida en tus respuestas para hacerlas visualmente atractivas (🍅🥕🧅🧄🌶️🥔🍆🥬🥦🌽🍄🥜🌰🍞🥖🥐🧀🥚🍖🥩🍗🐟🦐🍤🥘🍲🥗🍛🍜🍝🍕🌮🌯🥙🍳🥞🧇🥓).

RESTRICCIONES DIETÉTICAS CRÍTICAS:
- Si el usuario ha especificado filtros dietéticos (vegetariano, vegano, sin gluten, keto), DEBES seguirlos ESTRICTAMENTE.
- VEGETARIANO: SIN carne, aves, pescado o mariscos. Huevos y lácteos están permitidos.
- VEGANO: SIN productos animales en absoluto (sin carne, pescado, huevos, lácteos, miel).
- SIN GLUTEN: SIN trigo, cebada, centeno o ingredientes con gluten.
- KETO: Alto en grasas, muy bajo en carbohidratos (menos de 20g de carbohidratos netos por porción).

TAMAÑO DE PORCIÓN: Siempre escala los ingredientes para el número especificado de porciones. Indica claramente el tamaño de porción al principio con formato "👥 Sirve: X personas".

Siempre responde solo en español.`,

  fr: `Vous êtes ChefMaster AI, un chef professionnel passionné et de renommée mondiale.
Votre objectif est d'aider les utilisateurs à cuisiner de délicieux repas.
Lorsqu'on vous demande une recette:
1. Commencez par une description encourageante et appétissante.
2. Fournissez une liste "Ingrédients" clairement formatée avec des emojis alimentaires (ex., 🧅 Oignon, 🧂 Sel, 🥩 Viande).
3. Fournissez des "Instructions" en étapes numérotées claires.
4. Gardez un ton chaleureux, professionnel et encourageant.
5. Utilisez le format markdown (mettez en gras les termes clés avec **).

IMPORTANT: Use COLORFUL emojis and food icons throughout your responses (🍅🥕🧅🧄🌶️🥔🍆🥬🥦🌽🍄🥜🌰🍞🥖🥐🧀🥚🍖🥩🍗🐟🦐🍤🥘🍲🥗🍛🍜🍝🍕🌮🌯🥙🍳🥞🧇🥓).

RESTRICTIONS ALIMENTAIRES CRITIQUES:
- Si l'utilisateur a spécifié des filtres alimentaires (végétarien, végétalien, sans gluten, keto), vous DEVEZ les suivre STRICTEMENT.
- VÉGÉTARIEN: PAS de viande, volaille, poisson ou fruits de mer. Œufs et produits laitiers sont autorisés.
- VÉGÉTALIEN: AUCUN produit animal (pas de viande, poisson, œufs, produits laitiers, miel).
- SANS GLUTEN: PAS de blé, orge, seigle ou ingrédients contenant du gluten.
- KETO: Riche en graisses, très faible en glucides (moins de 20g de glucides nets par portion).

TAILLE DE PORTION: Toujours ajuster les ingrédients pour le nombre de portions spécifié. Indiquez clairement la taille de portion au début.

Répondez toujours uniquement en français.`,

  or: `ଆପଣ ChefMaster AI, ଜଣେ ବିଶ୍ୱ ପ୍ରସିଦ୍ଧ, passionate professional chef।
ଆପଣଙ୍କର ଲକ୍ଷ୍ୟ ହେଉଛି users କୁ ସ୍ୱାଦିଷ୍ଟ ଖାଦ୍ୟ ରାନ୍ଧିବାରେ ସାହାଯ୍ୟ କରିବା।
ଯେତେବେଳେ recipe ମାଗା ଯାଏ:
1. ଏକ encouraging, appetizing description ଦିଅନ୍ତୁ।
2. Food emojis ସହିତ "ସାମଗ୍ରୀ" list ଦିଅନ୍ତୁ (ଯେମିତି, 🧅 ପିଆଜ, 🧂 ଲୁଣ, 🥩 ମାଂସ)।
3. Clear, numbered steps ରେ "ନିର୍ଦ୍ଦେଶ" ଦିଅନ୍ତୁ।
4. Tone warm, professional, ଏବଂ encouraging ରଖନ୍ତୁ।
5. Markdown formatting use କରନ୍ତୁ (bold key terms **ସହିତ**)।

ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ: ଆପଣଙ୍କ ଉତ୍ତରରେ COLORFUL emojis ଏବଂ food icons ବ୍ୟବହାର କରନ୍ତୁ (🍅🥕🧅🧄🌶️🥔🍆🥬🥦🌽🍄🥜🌰🍞🥖🥐🧀🥚🍖🥩🍗🐟🦐🍤🥘🍲🥗🍛🍜🍝🍕🌮🌯🥙🍳🥞🧇🥓)।

ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଖାଦ୍ୟ ପ୍ରତିବନ୍ଧ:
- ଯଦି user dietary filters specify କରିଛନ୍ତି (ଶାକାହାରୀ, vegan, gluten-free, keto), ତେବେ ଆପଣ STRICTLY ସେଗୁଡିକୁ ପାଳନ କରିବା ଆବଶ୍ୟକ।
- ଶାକାହାରୀ (VEGETARIAN): କୌଣସି ମାଂସ, ମୁରଗୀ, ମାଛ, କିମ୍ବା seafood ନାହିଁ। ଅଣ୍ଡା ଏବଂ dairy allowed ଅଛି।
- VEGAN: କୌଣସି ପଶୁ ଉତ୍ପାଦ ନାହିଁ (ମାଂସ, ମାଛ, ଅଣ୍ଡା, dairy, ମହୁ କିଛି ନାହିଁ)।
- GLUTEN-FREE: ଗହମ, barley, rye, କିମ୍ବା କୌଣସି gluten ଥିବା ସାମଗ୍ରୀ ନାହିଁ।
- KETO: High fat, ବହୁତ କମ୍ carb (ପ୍ରତି serving ରେ 20g net carbs ରୁ କମ୍)।

SERVING SIZE: ସବୁବେଳେ specified ସଂଖ୍ୟା ପାଇଁ ingredients କୁ scale କରନ୍ତୁ। ଆରମ୍ଭରେ serving size ସ୍ପଷ୍ଟ ଭାବରେ କୁହନ୍ତୁ।

ସବୁବେଳେ କେବଳ ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ।`
};

// Initialize chat history with system prompt
let chatHistory = [{ role: "system", content: systemPrompts[currentLanguage] }];
const userData = { message: "" };

// ========== Theme Management ==========
const isDarkTheme = localStorage.getItem("themeColor") === "dark_mode";
document.body.classList.toggle("dark-theme", isDarkTheme);
updateThemeIcon();

function updateThemeIcon() {
  const isDark = document.body.classList.contains("dark-theme");
  themeToggleBtn.querySelector("i").className = isDark ? "fas fa-sun" : "fas fa-moon";
}

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("themeColor", isDark ? "dark_mode" : "light_mode");
  updateThemeIcon();
});

// ========== Modal Management ==========
openChatBtn.addEventListener("click", () => {
  chatModal.classList.add("show-modal");
  scrollToBottom();
  showQuickChips(); // Show quick suggestion chips
});

closeChatBtn.addEventListener("click", () => {
  chatModal.classList.remove("show-modal");
});

// ========== Drawer Management ==========
menuBtn.addEventListener("click", () => {
  sideDrawer.classList.add("open");
  drawerOverlay.classList.add("show");
});

drawerOverlay.addEventListener("click", () => {
  sideDrawer.classList.remove("open");
  drawerOverlay.classList.remove("show");
});

// ========== Language Management ==========
translateBtn.addEventListener("click", () => {
  languageModal.classList.add("show");
});

closeLanguageModal.addEventListener("click", () => {
  languageModal.classList.remove("show");
});

languageModal.addEventListener("click", (e) => {
  if (e.target === languageModal) {
    languageModal.classList.remove("show");
  }
});

document.querySelectorAll(".language-option").forEach(option => {
  if (option.dataset.lang === currentLanguage) {
    option.classList.add("active");
  }
  
  option.addEventListener("click", () => {
    currentLanguage = option.dataset.lang;
    localStorage.setItem("chefLanguage", currentLanguage);
    
    // Update active state
    document.querySelectorAll(".language-option").forEach(opt => 
      opt.classList.remove("active")
    );
    option.classList.add("active");
    
    // Update system prompt
    chatHistory[0] = { role: "system", content: systemPrompts[currentLanguage] };
    
    languageModal.classList.remove("show");
    
    // Show confirmation
    showToast(getTranslation("languageChanged"));
  });
});

// ========== Translations ==========
const translations = {
  languageChanged: {
    en: "Language changed successfully",
    hi: "भाषा सफलतापूर्वक बदली गई",
    hinglish: "Language successfully change ho gayi",
    es: "Idioma cambiado exitosamente",
    fr: "Langue changée avec succès",
    or: "ଭାଷା ସଫଳତାର ସହିତ ବଦଳାଗଲା"
  },
  chatCleared: {
    en: "Chat cleared",
    hi: "चैट साफ़ हो गई",
    hinglish: "Chat clear ho gayi",
    es: "Chat borrado",
    fr: "Chat effacé",
    or: "ଚାଟ୍ ସାଫ ହୋଇଗଲା"
  },
  filterApplied: {
    en: "Filter applied",
    hi: "फ़िल्टर लागू हुआ",
    hinglish: "Filter apply ho gaya",
    es: "Filtro aplicado",
    fr: "Filtre appliqué",
    or: "ଫିଲ୍ଟର ପ୍ରୟୋଗ ହେଲା"
  },
  recipeSaved: {
    en: "Recipe saved!",
    hi: "रेसिपी सहेजी गई!",
    hinglish: "Recipe save ho gayi!",
    es: "¡Receta guardada!",
    fr: "Recette sauvegardée !",
    or: "ରେସିପି ସେଭ ହୋଇଗଲା!"
  }
};

function getTranslation(key) {
  return translations[key]?.[currentLanguage] || translations[key]?.en || key;
}

// ========== Toast Notification ==========
function showToast(message) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    padding: 12px 24px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1000;
    box-shadow: var(--md-sys-elevation-3);
    animation: toastSlideUp 0.3s ease-out;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "toastSlideDown 0.3s ease-in forwards";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ========== Helper Functions ==========
const scrollToBottom = () => {
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
};

const createMessageElement = (content, ...classes) => {
  // Message render karte waqt edit button add karein (Sirf User ke liye)

  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const createUserMessage = (text) => {
  const messageHTML = `
    <div class="message-wrapper">
      <div class="message-avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="message-content">
        <p class="message-text">${escapeHtml(text)}</p>
      </div>
    </div>
  `;
  return createMessageElement(messageHTML, "user");
};

const createBotMessage = () => {
  const messageHTML = `
    <div class="message-wrapper">
      <div class="message-avatar">
        <i class="fas fa-utensils"></i>
      </div>
      <div class="message-content">
        <div class="message-text"></div>
        <div class="message-actions" style="display: none;">
          <button class="message-action-btn copy-btn">
            <i class="fas fa-copy"></i>
            <span>Copy</span>
          </button>
          <button class="message-action-btn tts-btn">
            <i class="fas fa-volume-up"></i>
            <span>Speak</span>
          </button>
          <button class="message-action-btn save-btn">
            <i class="fas fa-bookmark"></i>
            <span>Save</span>
          </button>
          <button class="message-action-btn share-btn">
            <i class="fab fa-whatsapp"></i>
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  `;
  return createMessageElement(messageHTML, "bot");
};

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// ========== SKELETON LOADER (Replaces Typing Indicator) ==========
function showSkeletonLoader() {
  const existingSkeleton = document.querySelector(".skeleton-loader");
  if (existingSkeleton) return;
  
  const skeletonHTML = `
    <div class="skeleton-loader show">
      <div class="skeleton-content">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-text-wrapper">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
        </div>
      </div>
    </div>
  `;
  
  chatsContainer.insertAdjacentHTML("beforeend", skeletonHTML);
  scrollToBottom();
}

function hideSkeletonLoader() {
  const skeleton = document.querySelector(".skeleton-loader");
  if (skeleton) {
    skeleton.remove();
  }
}

// ========== TEXT-TO-SPEECH (TTS) ==========
let currentSpeech = null;

function speakText(text, button) {
  // Stop any ongoing speech
  if (currentSpeech) {
    window.speechSynthesis.cancel();
    currentSpeech = null;
    // Reset all TTS buttons
    document.querySelectorAll(".tts-btn").forEach(btn => {
      btn.classList.remove("speaking");
      btn.innerHTML = '<i class="fas fa-volume-up"></i><span>Speak</span>';
    });
    return;
  }
  
  // Clean text for TTS (remove markdown and emojis for better pronunciation)
  const cleanText = text
    .replace(/[#*_`~]/g, '') // Remove markdown
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .replace(/\s+/g, ' ')
    .trim();
  
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Set voice properties
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  // Try to select a better voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.lang.startsWith('en') && voice.name.includes('Google')
  ) || voices.find(voice => voice.lang.startsWith('en'));
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Update button state
  button.classList.add("speaking");
  button.innerHTML = '<i class="fas fa-stop"></i><span>Stop</span>';
  
  utterance.onend = () => {
    button.classList.remove("speaking");
    button.innerHTML = '<i class="fas fa-volume-up"></i><span>Speak</span>';
    currentSpeech = null;
  };
  
  utterance.onerror = () => {
    button.classList.remove("speaking");
    button.innerHTML = '<i class="fas fa-volume-up"></i><span>Speak</span>';
    currentSpeech = null;
    showToast("Speech synthesis failed");
  };
  
  currentSpeech = utterance;
  window.speechSynthesis.speak(utterance);
}

// ========== STREAMING RESPONSE with Marked.js ==========
async function streamResponse(text, textElement, botMsgDiv, originalText) {
  textElement.innerHTML = "";
  
  let accumulatedText = "";
  const words = text.split(" ");
  
  for (let i = 0; i < words.length; i++) {
    accumulatedText += (i === 0 ? "" : " ") + words[i];
    
    // Use marked.js to render markdown
    if (typeof marked !== 'undefined') {
      textElement.innerHTML = marked.parse(accumulatedText);
    } else {
      // Fallback to basic markdown
      textElement.innerHTML = accumulatedText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
        .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
        .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>');
    }
    
    scrollToBottom();
    await new Promise(resolve => setTimeout(resolve, 30)); // Streaming delay
  }
  
  // Final render
  if (typeof marked !== 'undefined') {
    textElement.innerHTML = marked.parse(text);
  }
  
  // Show action buttons
  hideSkeletonLoader();
  document.body.classList.remove("bot-responding");
  
  const actionsDiv = botMsgDiv.querySelector(".message-actions");
  if (actionsDiv) {
    actionsDiv.style.display = "flex";
    setupMessageActions(botMsgDiv, originalText);
  }
  
  scrollToBottom();
}

// ========== SAVED RECIPES FUNCTIONALITY ==========
function saveRecipe(recipeText) {
  // Generate recipe image based on content
  const categoryImages = {
    indian: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500",
    chinese: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
    italian: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    western: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
  };
  
  // Detect category
  let recipeImage = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500";
  const lowerText = recipeText.toLowerCase();
  if (lowerText.includes('masala') || lowerText.includes('curry') || lowerText.includes('tikka') || lowerText.includes('paneer')) {
    recipeImage = categoryImages.indian;
  } else if (lowerText.includes('noodles') || lowerText.includes('fried rice') || lowerText.includes('manchurian')) {
    recipeImage = categoryImages.chinese;
  } else if (lowerText.includes('pasta') || lowerText.includes('pizza') || lowerText.includes('risotto') || lowerText.includes('lasagna')) {
    recipeImage = categoryImages.italian;
  } else if (lowerText.includes('burger') || lowerText.includes('steak') || lowerText.includes('bbq') || lowerText.includes('wings')) {
    recipeImage = categoryImages.western;
  }
  
  const recipe = {
    id: Date.now().toString(),
    name: extractRecipeTitle(recipeText),
    title: extractRecipeTitle(recipeText),
    content: recipeText,
    image: recipeImage,
    date: new Date().toLocaleDateString(),
    timestamp: new Date().toISOString(),
    tags: extractTags()
  };
  
  savedRecipes.unshift(recipe);
  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  showToast(getTranslation("recipeSaved"));
  
  // Update saved recipes list in drawer
  updateSavedRecipesList();
}

function extractRecipeTitle(text) {
  // Try to extract title from markdown headings
  const match = text.match(/^#\s+(.+)$/m) || text.match(/^\*\*(.+)\*\*$/m);
  if (match) return match[1].substring(0, 50);
  
  // Fallback: first line
  const firstLine = text.split('\n')[0].replace(/[#*]/g, '').trim();
  return firstLine.substring(0, 50) || "Saved Recipe";
}

function extractTags() {
  const tags = [];
  if (activeFilters.length > 0) tags.push(...activeFilters);
  if (currentCategory) tags.push(currentCategory);
  tags.push(`${servingSize} servings`);
  return tags;
}

function openSavedRecipesModal() {
  let modal = document.querySelector(".saved-recipes-modal");
  
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "saved-recipes-modal";
    modal.innerHTML = `
      <div class="saved-recipes-content">
        <div class="saved-recipes-header">
          <h2><i class="fas fa-bookmark"></i> Saved Recipes</h2>
          <button class="icon-btn close-saved-recipes">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="saved-recipes-body"></div>
      </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector(".close-saved-recipes").addEventListener("click", () => {
      modal.classList.remove("show");
    });
    
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  }
  
  renderSavedRecipes();
  modal.classList.add("show");
}

function renderSavedRecipes() {
  const modal = document.querySelector(".saved-recipes-modal");
  const body = modal.querySelector(".saved-recipes-body");
  
  if (savedRecipes.length === 0) {
    body.innerHTML = `
      <div class="empty-saved-recipes">
        <i class="fas fa-bookmark"></i>
        <h3>No Saved Recipes</h3>
        <p>Start saving your favorite recipes!</p>
      </div>
    `;
    return;
  }
  
  body.innerHTML = savedRecipes.map(recipe => `
    <div class="saved-recipe-card" data-id="${recipe.id}">
      <div class="saved-recipe-header">
        <div>
          <div class="saved-recipe-title">${recipe.title}</div>
          <div class="saved-recipe-date">${recipe.date}</div>
        </div>
        <div class="saved-recipe-actions">
          <button class="saved-recipe-btn view-recipe-btn" title="View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="saved-recipe-btn share-recipe-btn" title="Share">
            <i class="fab fa-whatsapp"></i>
          </button>
          <button class="saved-recipe-btn delete-recipe-btn" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="saved-recipe-preview">${recipe.content.substring(0, 150)}...</div>
      <div class="saved-recipe-tags">
        ${recipe.tags.map(tag => `<span class="saved-recipe-tag">${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');
  
  // Add event listeners
  body.querySelectorAll(".view-recipe-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest(".saved-recipe-card").dataset.id);
      viewRecipe(id);
    });
  });
  
  body.querySelectorAll(".share-recipe-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest(".saved-recipe-card").dataset.id);
      shareRecipeToWhatsApp(id);
    });
  });
  
  body.querySelectorAll(".delete-recipe-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest(".saved-recipe-card").dataset.id);
      deleteRecipe(id);
    });
  });
}

function viewRecipe(id) {
  const recipe = savedRecipes.find(r => r.id === id);
  if (recipe) {
    // Create and show recipe in chat
    const botMsg = createBotMessage();
    welcomeScreen.style.display = "none";
    chatsContainer.appendChild(botMsg);
    
    const textElement = botMsg.querySelector(".message-text");
    if (typeof marked !== 'undefined') {
      textElement.innerHTML = marked.parse(recipe.content);
    } else {
      textElement.textContent = recipe.content;
    }
    
    const actionsDiv = botMsg.querySelector(".message-actions");
    actionsDiv.style.display = "flex";
    setupMessageActions(botMsg, recipe.content);
    
    scrollToBottom();
    document.querySelector(".saved-recipes-modal").classList.remove("show");
  }
}

function shareRecipeToWhatsApp(id) {
  const recipe = savedRecipes.find(r => r.id === id);
  if (recipe) {
    const text = `🍳 *${recipe.title}* from ChefMaster AI\n\n${recipe.content}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }
}

function deleteRecipe(id) {
  showConfirmDialog(
    "Delete Recipe?",
    "This recipe will be permanently removed from your saved collection.",
    "fa-trash-alt"
  ).then(confirmed => {
    if (confirmed) {
      savedRecipes = savedRecipes.filter(r => r.id !== id);
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
      renderSavedRecipes();
      showToast("Recipe deleted");
    }
  });
}

// Add "Saved Recipes" button to drawer
document.querySelector(".drawer-content").insertAdjacentHTML("afterbegin", `
  <div class="drawer-section">
    <button class="drawer-item" id="open-saved-recipes">
      <i class="fas fa-bookmark"></i>
      <span>Saved Recipes</span>
    </button>
  </div>
`);

document.querySelector("#open-saved-recipes").addEventListener("click", () => {
  openSavedRecipesModal();
  sideDrawer.classList.remove("open");
  drawerOverlay.classList.remove("show");
});

// ========== QUICK SUGGESTION CHIPS ==========
const quickSuggestionsData = [
  { icon: "fa-bolt", text: "15-min Meal", query: "Quick 15-minute meal recipe" },
  { icon: "fa-leaf", text: "Vegan Dinner", query: "Vegan dinner recipe" },
  { icon: "fa-bacon", text: "Keto Snack", query: "Keto-friendly snack" },
  { icon: "fa-pizza-slice", text: "Pasta", query: "Delicious pasta recipe" },
  { icon: "fa-pepper-hot", text: "Indian Curry", query: "Indian curry recipe banao" },
  { icon: "fa-pot-food", text: "One-Pot Meal", query: "One-pot meal recipe" },
  { icon: "fa-birthday-cake", text: "Dessert", query: "Easy dessert recipe" },
  { icon: "fa-glass-water", text: "Smoothie", query: "Healthy smoothie recipe" },
  { icon: "fa-champagne-glasses", text: "Party Menu", query: "Mujhe party ka menu plan karna hai" }
];

function showQuickChips() {
  let quickChipsContainer = document.querySelector(".quick-suggestions");
  
  if (!quickChipsContainer) {
    quickChipsContainer = document.createElement("div");
    quickChipsContainer.className = "quick-suggestions";
    quickChipsContainer.innerHTML = `
      <div class="quick-chips-wrapper"></div>
    `;
    
    const promptContainer = document.querySelector(".prompt-container");
    promptContainer.insertBefore(quickChipsContainer, promptContainer.firstChild);
  }
  
  const wrapper = quickChipsContainer.querySelector(".quick-chips-wrapper");
  wrapper.innerHTML = quickSuggestionsData.map(chip => `
    <button class="quick-chip" data-query="${chip.query}">
      <i class="fas ${chip.icon}"></i>
      <span>${chip.text}</span>
    </button>
  `).join('');
  
  quickChipsContainer.classList.add("show");
  
  // Add click handlers
  wrapper.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      promptInput.value = chip.dataset.query;
      promptForm.dispatchEvent(new Event('submit'));
    });
  });
}

// ========== MESSAGE ACTIONS (Copy, TTS, Save, WhatsApp Share) ==========
const setupMessageActions = (messageDiv, originalText) => {
  const copyBtn = messageDiv.querySelector(".copy-btn");
  const ttsBtn = messageDiv.querySelector(".tts-btn");
  const saveBtn = messageDiv.querySelector(".save-btn");
  const shareBtn = messageDiv.querySelector(".share-btn");
  
  // Copy functionality
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(originalText);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
        copyBtn.classList.add("copied");
        
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.classList.remove("copied");
        }, 2000);
      } catch (err) {
        showToast("Failed to copy");
      }
    });
  }
  
  // TTS functionality
  if (ttsBtn) {
    ttsBtn.addEventListener("click", () => {
      speakText(originalText, ttsBtn);
    });
  }
  
  // Save functionality
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveRecipe(originalText);
      saveBtn.innerHTML = '<i class="fas fa-check"></i><span>Saved!</span>';
      saveBtn.classList.add("saved");
      
      setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-bookmark"></i><span>Save</span>';
        saveBtn.classList.remove("saved");
      }, 2000);
    });
  }
  
  // WhatsApp share functionality
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const text = `🍳 Recipe from ChefMaster AI\n\n${originalText}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    });
  }
};

// ========== VOICE INPUT with AUTO-SEND ==========
function initializeVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    voiceInputBtn.style.display = "none";
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
  
  recognition.onstart = () => {
    isRecording = true;
    voiceInputBtn.classList.add("recording");
    voiceInputBtn.innerHTML = '<i class="fas fa-stop"></i>';
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    promptInput.value = transcript;
    
    // AUTO-SEND: Automatically submit after voice input
    setTimeout(() => {
      if (promptInput.value.trim()) {
        promptForm.dispatchEvent(new Event('submit'));
      }
    }, 500);
  };
  
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    showToast("Voice input failed. Please try again.");
    resetVoiceButton();
  };
  
  recognition.onend = () => {
    resetVoiceButton();
  };
  
  voiceInputBtn.addEventListener("click", () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });
}

function resetVoiceButton() {
  isRecording = false;
  voiceInputBtn.classList.remove("recording");
  voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
}

// Initialize voice input
initializeVoiceInput();

// ========== MAIN CHAT FUNCTIONALITY ==========
promptForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const userMessage = promptInput.value.trim();
  if (!userMessage) return;
  
  // Hide welcome screen
  welcomeScreen.style.display = "none";
  
  // Create user message
  const userMsg = createUserMessage(userMessage);
  chatsContainer.appendChild(userMsg);
  promptInput.value = "";
  
  // Show skeleton loader instead of typing indicator
  showSkeletonLoader();
  document.body.classList.add("bot-responding");
  
  // Build enhanced prompt with context
  const enhancedPrompt = buildUserPrompt(userMessage);
  
  // Add to chat history
  chatHistory.push({ role: "user", content: enhancedPrompt });
  
  // Scroll to bottom
  scrollToBottom();
  
  // Create bot message
  const botMsg = createBotMessage();
  chatsContainer.appendChild(botMsg);
  
  // Call API with streaming
  try {
    controller = new AbortController();
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": window.location.href,
        "X-Title": "ChefMaster AI"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: chatHistory,
        temperature: 0.7,
        max_tokens: 2000
      }),
      signal: controller.signal
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    const botResponse = data.choices[0].message.content;
    
    // Add to history
    chatHistory.push({ role: "assistant", content: botResponse });
    
    // Hide skeleton and stream response
    hideSkeletonLoader();
    const textElement = botMsg.querySelector(".message-text");
    await streamResponse(botResponse, textElement, botMsg, botResponse);
    
    // Clear image after use
    uploadedImage = null;
    const previewContainer = document.querySelector(".image-preview-container");
    if (previewContainer) {
      previewContainer.classList.remove("show");
    }
    
  } catch (error) {
    hideSkeletonLoader();
    document.body.classList.remove("bot-responding");
    
    if (error.name === "AbortError") {
      const textElement = botMsg.querySelector(".message-text");
      textElement.textContent = "Response stopped.";
    } else {
      const textElement = botMsg.querySelector(".message-text");
      textElement.textContent = "Sorry, I encountered an error. Please try again.";
      textElement.style.color = "#d32f2f";
      console.error("API Error:", error);
    }
    
    botMsg.querySelector(".message-actions").remove();
  }
});

// Stop button
document.querySelector("#stop-response-btn").addEventListener("click", () => {
  if (controller) {
    controller.abort();
    hideSkeletonLoader();
    document.body.classList.remove("bot-responding");
  }
  
  if (currentSpeech) {
    window.speechSynthesis.cancel();
    currentSpeech = null;
  }
});

// ========== MODERN NATIVE CONFIRMATION DIALOG ==========
function showConfirmDialog(title, message, icon = "fa-question-circle") {
  return new Promise((resolve) => {
    // Remove existing dialog if any
    const existingDialog = document.querySelector(".confirmation-dialog");
    if (existingDialog) existingDialog.remove();
    
    const dialog = document.createElement("div");
    dialog.className = "confirmation-dialog show";
    dialog.innerHTML = `
      <div class="confirmation-content">
        <div class="confirmation-icon">
          <i class="fas ${icon}"></i>
        </div>
        <h3 class="confirmation-title">${title}</h3>
        <p class="confirmation-message">${message}</p>
        <div class="confirmation-actions">
          <button class="confirmation-btn confirmation-btn-cancel">Cancel</button>
          <button class="confirmation-btn confirmation-btn-confirm">Confirm</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    const cancelBtn = dialog.querySelector(".confirmation-btn-cancel");
    const confirmBtn = dialog.querySelector(".confirmation-btn-confirm");
    
    function cleanup() {
      dialog.classList.remove("show");
      setTimeout(() => dialog.remove(), 300);
    }
    
    cancelBtn.addEventListener("click", () => {
      cleanup();
      resolve(false);
    });
    
    confirmBtn.addEventListener("click", () => {
      cleanup();
      resolve(true);
    });
    
    // Click outside to cancel
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        cleanup();
        resolve(false);
      }
    });
  });
}

// ========== DRAWER ACTIONS ==========
// New Chat
document.querySelector('[data-action="new-chat"]')?.addEventListener("click", async () => {
  const confirmed = await showConfirmDialog(
    "Start New Chat?",
    "Your current conversation will be cleared. This cannot be undone.",
    "fa-comments"
  );
  
  if (confirmed) {
    chatsContainer.innerHTML = "";
    welcomeScreen.style.display = "flex";
    chatHistory = [{ role: "system", content: systemPrompts[currentLanguage] }];
    sideDrawer.classList.remove("open");
    drawerOverlay.classList.remove("show");
    showToast(getTranslation("chatCleared"));
  }
});

// Clear All
document.querySelector('[data-action="clear-all"]')?.addEventListener("click", async () => {
  const confirmed = await showConfirmDialog(
    "Clear All Chats?",
    "This will permanently delete all your conversations.",
    "fa-trash-alt"
  );
  
  if (confirmed) {
    chatsContainer.innerHTML = "";
    welcomeScreen.style.display = "flex";
    chatHistory = [{ role: "system", content: systemPrompts[currentLanguage] }];
    sideDrawer.classList.remove("open");
    drawerOverlay.classList.remove("show");
    showToast(getTranslation("chatCleared"));
  }
});

// Category selection with AUTO-SEND
document.querySelectorAll(".category-item").forEach(item => {
  item.addEventListener("click", () => {
    currentCategory = item.dataset.category;
    document.querySelectorAll(".category-item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    
    sideDrawer.classList.remove("open");
    drawerOverlay.classList.remove("show");
    
    // AUTO-SEND category query
    const categoryQueries = {
      'breakfast': 'Show me delicious breakfast recipes',
      'lunch': 'Suggest me lunch and dinner ideas',
      'dessert': 'Give me some dessert recipes',
      'snacks': 'Quick and tasty snack recipes chahiye',
      'beverages': 'Refreshing beverage recipes batao',
      'healthy': 'Healthy meal options dikhao'
    };
    
    const query = categoryQueries[currentCategory];
    if (query) {
      promptInput.value = query;
      setTimeout(() => {
        promptForm.dispatchEvent(new Event('submit'));
      }, 300);
    }
  });
});

// Smart Features with AUTO-SEND and Indian Party Intelligence
document.querySelectorAll('.drawer-item[data-action]').forEach(item => {
  const action = item.dataset.action;
  
  // Skip new-chat and clear-all as they're already handled
  if (action === 'new-chat' || action === 'clear-all') return;
  
  item.addEventListener('click', () => {
    sideDrawer.classList.remove("open");
    drawerOverlay.classList.remove("show");
    
    const smartQueries = {
      'meal-planner': 'Create a weekly meal plan for me',
      'grocery-list': 'Generate a grocery shopping list',
      'nutrition': 'Give me nutritional information and healthy tips',
      'cooking-tips': 'Share some professional cooking tips and tricks'
    };
    
    const query = smartQueries[action];
    if (query) {
      promptInput.value = query;
      setTimeout(() => {
        promptForm.dispatchEvent(new Event('submit'));
      }, 300);
    }
  });
});

// Add Party Planning Smart Feature
const smartFeaturesSection = document.querySelector('.drawer-section:has([data-action="meal-planner"])');
if (smartFeaturesSection && !document.querySelector('[data-action="party-planner"]')) {
  const partyPlannerBtn = document.createElement('button');
  partyPlannerBtn.className = 'drawer-item';
  partyPlannerBtn.setAttribute('data-action', 'party-planner');
  partyPlannerBtn.innerHTML = `
    <i class="fas fa-birthday-cake"></i>
    <span>Party/Bhoj Planner 🇮🇳</span>
  `;
  
  smartFeaturesSection.appendChild(partyPlannerBtn);
  
  partyPlannerBtn.addEventListener('click', () => {
    sideDrawer.classList.remove("open");
    drawerOverlay.classList.remove("show");
    
    promptInput.value = 'Mujhe ek party/bhoj plan karna hai. Help karo please!';
    setTimeout(() => {
      promptForm.dispatchEvent(new Event('submit'));
    }, 300);
  });
}

// Filter selection
document.querySelectorAll(".filter-item").forEach(item => {
  item.addEventListener("click", () => {
    const filter = item.dataset.filter;
    
    if (activeFilters.includes(filter)) {
      activeFilters = activeFilters.filter(f => f !== filter);
      item.classList.remove("active");
    } else {
      activeFilters.push(filter);
      item.classList.add("active");
    }
    
    updateActiveFilters();
    showToast(getTranslation("filterApplied"));
  });
});

function updateActiveFilters() {
  if (activeFilters.length === 0) {
    activeFiltersDiv.classList.remove("show");
    return;
  }
  
  activeFiltersDiv.classList.add("show");
  filterChipsDiv.innerHTML = activeFilters.map(filter => `
    <div class="filter-chip" data-filter="${filter}">
      <i class="fas fa-times"></i>
      <span>${filter}</span>
    </div>
  `).join('');
  
  filterChipsDiv.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      activeFilters = activeFilters.filter(f => f !== filter);
      
      document.querySelectorAll(".filter-item").forEach(item => {
        if (item.dataset.filter === filter) {
          item.classList.remove("active");
        }
      });
      
      updateActiveFilters();
    });
  });
}

// Serving size
function initializeServingSize() {
  document.querySelectorAll(".serving-btn").forEach(btn => {
    if (parseInt(btn.dataset.servings) === servingSize) {
      btn.classList.add("active");
    }
    
    btn.addEventListener("click", () => {
      servingSize = parseInt(btn.dataset.servings);
      localStorage.setItem("servingSize", servingSize);
      
      document.querySelectorAll(".serving-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      showToast(`Serving size: ${servingSize} people`);
      
      sideDrawer.classList.remove("open");
      drawerOverlay.classList.remove("show");
    });
  });
}

// Custom serving size
document.querySelector(".apply-custom-btn")?.addEventListener("click", () => {
  const customInput = document.querySelector("#custom-servings");
  const value = parseInt(customInput.value);
  
  if (value >= 1 && value <= 50) {
    servingSize = value;
    localStorage.setItem("servingSize", servingSize);
    
    document.querySelectorAll(".serving-btn").forEach(btn => btn.classList.remove("active"));
    
    showToast(`Serving size set to ${servingSize} people`);
    customInput.value = "";
    
    sideDrawer.classList.remove("open");
    drawerOverlay.classList.remove("show");
  } else {
    showToast("Please enter a number between 1 and 50");
  }
});

// ========== IMAGE UPLOAD ==========
const imageUploadInput = document.querySelector("#image-upload");
const attachBtn = document.querySelector(".attach-btn");

attachBtn.addEventListener("click", () => {
  imageUploadInput.click();
});

imageUploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showToast("Please upload an image file");
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    showToast("Image too large. Max size is 5MB");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    uploadedImage = event.target.result;
    uploadedImageName = file.name;
    uploadedImageSize = (file.size / 1024).toFixed(2) + " KB";
    
    showImagePreview();
    showToast("Image uploaded! Ask me about it.");
  };
  reader.readAsDataURL(file);
});

function showImagePreview() {
  let previewContainer = document.querySelector(".image-preview-container");
  if (!previewContainer) {
    previewContainer = document.createElement("div");
    previewContainer.className = "image-preview-container";
    previewContainer.innerHTML = `
      <img class="image-preview" src="" alt="Preview">
      <div class="image-preview-info">
        <div class="image-preview-name"></div>
        <div class="image-preview-size"></div>
      </div>
      <button class="remove-image-btn">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    const promptWrapper = document.querySelector(".prompt-wrapper");
    promptWrapper.parentNode.insertBefore(previewContainer, promptWrapper);
    
    previewContainer.querySelector(".remove-image-btn").addEventListener("click", () => {
      uploadedImage = null;
      uploadedImageName = "";
      uploadedImageSize = "";
      previewContainer.classList.remove("show");
      imageUploadInput.value = "";
    });
  }
  
  previewContainer.querySelector(".image-preview").src = uploadedImage;
  previewContainer.querySelector(".image-preview-name").textContent = uploadedImageName;
  previewContainer.querySelector(".image-preview-size").textContent = uploadedImageSize;
  previewContainer.classList.add("show");
}

// ========== SUGGESTION CARDS ==========
document.querySelectorAll(".suggestion-card").forEach(card => {
  card.addEventListener("click", () => {
    const text = card.querySelector("p").textContent;
    promptInput.value = text;
    promptForm.dispatchEvent(new Event('submit'));
  });
});

// ========== CAROUSEL ==========
let currentSlide = 0;
let carouselInterval = null;
const suggestionsElement = document.querySelector(".suggestions");
const suggestionCards = document.querySelectorAll(".suggestion-card");
const carouselDotsContainer = document.querySelector(".carousel-dots");

if (suggestionsElement && suggestionCards.length > 0) {
  const getVisibleCards = () => {
    if (window.innerWidth >= 1200) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };
  
  function createDots() {
    carouselDotsContainer.innerHTML = "";
    const slides = Math.ceil(suggestionCards.length / getVisibleCards());
    for (let i = 0; i < slides; i++) {
      const dot = document.createElement("div");
      dot.className = "carousel-dot";
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      carouselDotsContainer.appendChild(dot);
    }
  }
  
  createDots();
  
  function updateCarousel() {
    const visibleCards = getVisibleCards();
    const cardWidth = suggestionCards[0].offsetWidth;
    const gap = 16;
    const offset = -(currentSlide * visibleCards * (cardWidth + gap));
    
    suggestionsElement.style.transform = `translateX(${offset}px)`;
    
    document.querySelectorAll(".carousel-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }
  
  function goToSlide(index) {
    const maxSlide = Math.ceil(suggestionCards.length / getVisibleCards()) - 1;
    currentSlide = Math.max(0, Math.min(index, maxSlide));
    updateCarousel();
    resetAutoSlide();
  }
  
  function nextSlide() {
    const maxSlide = Math.ceil(suggestionCards.length / getVisibleCards()) - 1;
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    updateCarousel();
  }
  
  function prevSlide() {
    const maxSlide = Math.ceil(suggestionCards.length / getVisibleCards()) - 1;
    currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
    updateCarousel();
  }
  
  function startAutoSlide() {
    carouselInterval = setInterval(nextSlide, 5000);
  }
  
  function resetAutoSlide() {
    clearInterval(carouselInterval);
    startAutoSlide();
  }
  
  document.querySelector(".next-btn")?.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });
  
  document.querySelector(".prev-btn")?.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  suggestionsElement.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  suggestionsElement.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) {
      nextSlide();
      resetAutoSlide();
    }
    if (touchEndX > touchStartX + 50) {
      prevSlide();
      resetAutoSlide();
    }
  });
  
  window.addEventListener("resize", () => {
    createDots();
    currentSlide = 0;
    updateCarousel();
  });
  
  startAutoSlide();
  
  document.querySelector(".suggestions-carousel")?.addEventListener("mouseenter", () => {
    clearInterval(carouselInterval);
  });
  
  document.querySelector(".suggestions-carousel")?.addEventListener("mouseleave", () => {
    startAutoSlide();
  });
}

// ========== ENHANCED PROMPT BUILDER ==========
function buildUserPrompt(userMessage) {
  let prompt = "";
  
  prompt += `[Serving size: ${servingSize} people]\n`;
  
  if (activeFilters.length > 0) {
    prompt += `[Dietary restrictions: ${activeFilters.join(", ")}]\n`;
  }
  
  if (currentCategory) {
    prompt += `[Category: ${currentCategory}]\n`;
  }
  
  prompt += `\n${userMessage}`;
  
  if (uploadedImage) {
    prompt += `\n\n[Note: User has uploaded an image. Please analyze it and provide relevant cooking advice, recipe, or ingredient identification based on the image.]`;
  }
  
  return prompt;
}

// ========== INITIALIZE ==========
initializeServingSize();
console.log("🧑‍🍳 ChefMaster AI Enhanced initialized!");
console.log(`Language: ${currentLanguage}`);
console.log(`Serving size: ${servingSize} people`);
console.log(`Saved recipes: ${savedRecipes.length}`);
