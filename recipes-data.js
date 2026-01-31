// ========== Recipe Library Data ==========
// 20 Pre-made Dishes with Online Images

const recipesDatabase = [
  // INDIAN STREET FOOD
  {
    id: 1,
    name: "Pani Puri",
    category: "indian",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500",
    prepTime: "30 min",
    difficulty: "Medium",
    servings: 4,
    description: "Crispy puris filled with spicy tangy water",
    ingredients: [
      "🥔 4 medium potatoes, boiled",
      "🫘 1 cup boiled chickpeas",
      "🌶️ 2-3 green chilies",
      "🌿 1 cup mint leaves",
      "🌿 1 cup coriander leaves",
      "🍋 2 tbsp tamarind pulp",
      "🧂 Salt to taste",
      "🌶️ 1 tsp red chili powder",
      "🍪 30-40 ready-made puris"
    ],
    instructions: [
      "Blend mint, coriander, green chilies with water to make pani",
      "Add tamarind, salt, chili powder, and mix well",
      "Mash potatoes and chickpeas with spices",
      "Make a hole in each puri",
      "Fill with potato mixture",
      "Pour the spicy pani and serve immediately"
    ]
  },
  {
    id: 2,
    name: "Vada Pav",
    category: "indian",
    image: "https://images.unsplash.com/photo-1601050690117-c4aa77c0fe67?w=500",
    prepTime: "40 min",
    difficulty: "Medium",
    servings: 6,
    description: "Mumbai's iconic potato fritter sandwich",
    ingredients: [
      "🥔 4 large potatoes",
      "🧅 2 tbsp mustard seeds",
      "🌿 Curry leaves",
      "🌶️ 3-4 green chilies",
      "🧄 1 tsp ginger paste",
      "🌶️ Turmeric, red chili powder",
      "🍞 6 pav buns",
      "🥄 Besan (gram flour) for coating",
      "🥄 Oil for frying"
    ],
    instructions: [
      "Boil and mash potatoes",
      "Prepare tadka with mustard, curry leaves, chilies",
      "Mix mashed potato with tadka and spices",
      "Make round vadas from the mixture",
      "Prepare besan batter and coat vadas",
      "Deep fry until golden brown",
      "Serve in pav with chutneys"
    ]
  },
  {
    id: 3,
    name: "Butter Chicken",
    category: "indian",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500",
    prepTime: "60 min",
    difficulty: "Medium",
    servings: 4,
    description: "Creamy tomato-based chicken curry",
    ingredients: [
      "🍗 500g chicken pieces",
      "🍅 4 large tomatoes",
      "🧅 2 onions",
      "🧈 100g butter",
      "🥛 1 cup cream",
      "🧄 2 tbsp ginger-garlic paste",
      "🌶️ Kashmiri red chili powder",
      "🌿 Kasuri methi",
      "🧂 Salt, garam masala"
    ],
    instructions: [
      "Marinate chicken with yogurt and spices for 2 hours",
      "Grill or pan-fry marinated chicken",
      "Make tomato-onion gravy with butter",
      "Add cream and spices",
      "Add grilled chicken to gravy",
      "Finish with kasuri methi and cream",
      "Serve hot with naan or rice"
    ]
  },
  {
    id: 4,
    name: "Chole Bhature",
    category: "indian",
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500",
    prepTime: "90 min",
    difficulty: "Hard",
    servings: 4,
    description: "Spicy chickpeas with fluffy fried bread",
    ingredients: [
      "🫘 2 cups chickpeas (soaked overnight)",
      "🍅 3 tomatoes",
      "🧅 2 onions",
      "🌶️ 2-3 green chilies",
      "🧄 Ginger-garlic paste",
      "🌿 Chole masala",
      "🍞 2 cups maida (all-purpose flour)",
      "🥛 Yogurt for dough",
      "🥄 Oil for frying"
    ],
    instructions: [
      "Pressure cook chickpeas until soft",
      "Prepare gravy with onions, tomatoes, and spices",
      "Add boiled chickpeas and simmer",
      "For bhature: knead dough with maida, yogurt, salt",
      "Let dough rest for 2 hours",
      "Roll into circles and deep fry until puffed",
      "Serve hot chole with bhature"
    ]
  },
  {
    id: 5,
    name: "Samosa",
    category: "indian",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
    prepTime: "60 min",
    difficulty: "Medium",
    servings: 8,
    description: "Crispy triangular pastry with spiced filling",
    ingredients: [
      "🥔 4 potatoes, boiled",
      "🫛 1/2 cup green peas",
      "🌿 Coriander leaves",
      "🌶️ Green chilies",
      "🧄 Ginger, cumin seeds",
      "🍞 2 cups maida",
      "🧈 4 tbsp ghee",
      "🥄 Oil for frying"
    ],
    instructions: [
      "Make dough with maida, ghee, and water",
      "Prepare filling with mashed potatoes, peas, spices",
      "Roll dough into circles, cut in half",
      "Form cone shapes and fill with mixture",
      "Seal edges with water",
      "Deep fry on medium heat until golden",
      "Serve with chutney"
    ]
  },

  // CHINESE DISHES
  {
    id: 6,
    name: "Chicken Fried Rice",
    category: "chinese",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
    prepTime: "25 min",
    difficulty: "Easy",
    servings: 4,
    description: "Classic Chinese fried rice with vegetables",
    ingredients: [
      "🍚 3 cups cooked rice (cold)",
      "🍗 300g chicken, diced",
      "🥚 2 eggs",
      "🥕 1 carrot, diced",
      "🫛 1/2 cup green beans",
      "🧅 2 spring onions",
      "🧄 2 cloves garlic",
      "🥫 Soy sauce, vinegar",
      "🌶️ Black pepper"
    ],
    instructions: [
      "Cook and dice chicken pieces",
      "Scramble eggs separately",
      "Heat oil in wok, add garlic",
      "Stir-fry vegetables until crisp",
      "Add chicken and cold rice",
      "Season with soy sauce and pepper",
      "Mix in scrambled eggs and spring onions",
      "Serve hot"
    ]
  },
  {
    id: 7,
    name: "Manchurian",
    category: "chinese",
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500",
    prepTime: "35 min",
    difficulty: "Medium",
    servings: 4,
    description: "Indo-Chinese crispy vegetable balls in sauce",
    ingredients: [
      "🥬 2 cups cabbage, grated",
      "🥕 1 carrot, grated",
      "🫛 1/2 cup beans, chopped",
      "🌽 2 tbsp cornflour",
      "🍞 2 tbsp maida",
      "🧄 Ginger-garlic paste",
      "🥫 Soy sauce, chili sauce",
      "🧅 Spring onions",
      "🥄 Oil for frying"
    ],
    instructions: [
      "Mix vegetables with cornflour, maida, salt",
      "Form into small balls",
      "Deep fry until golden and crispy",
      "Prepare sauce with soy sauce, chili sauce, vinegar",
      "Add ginger-garlic paste to sauce",
      "Toss fried balls in sauce",
      "Garnish with spring onions",
      "Serve hot as appetizer"
    ]
  },
  {
    id: 8,
    name: "Hakka Noodles",
    category: "chinese",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: 3,
    description: "Stir-fried noodles with vegetables",
    ingredients: [
      "🍜 200g noodles",
      "🥬 1 cup cabbage, shredded",
      "🥕 1 carrot, julienned",
      "🫑 1 bell pepper",
      "🧅 2 spring onions",
      "🧄 3 cloves garlic",
      "🥫 Soy sauce, vinegar",
      "🌶️ Chili sauce",
      "🥄 Sesame oil"
    ],
    instructions: [
      "Boil noodles as per package instructions",
      "Drain and toss with oil to prevent sticking",
      "Heat oil in wok, add garlic",
      "Stir-fry all vegetables on high heat",
      "Add boiled noodles",
      "Season with sauces and vinegar",
      "Toss everything together",
      "Garnish with spring onions"
    ]
  },
  {
    id: 9,
    name: "Sweet and Sour Chicken",
    category: "chinese",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500",
    prepTime: "40 min",
    difficulty: "Medium",
    servings: 4,
    description: "Crispy chicken in tangy sweet sauce",
    ingredients: [
      "🍗 500g chicken breast",
      "🥚 1 egg",
      "🌽 Cornflour for coating",
      "🍅 2 tbsp tomato ketchup",
      "🥫 3 tbsp vinegar",
      "🍯 3 tbsp sugar",
      "🫑 1 bell pepper, cubed",
      "🍍 1/2 cup pineapple chunks",
      "🥄 Oil for frying"
    ],
    instructions: [
      "Cut chicken into bite-size pieces",
      "Coat with egg and cornflour",
      "Deep fry until golden and crispy",
      "Prepare sweet-sour sauce with ketchup, vinegar, sugar",
      "Stir-fry bell peppers and pineapple",
      "Add sauce and let it thicken",
      "Toss fried chicken in sauce",
      "Serve immediately"
    ]
  },
  {
    id: 10,
    name: "Spring Rolls",
    category: "chinese",
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500",
    prepTime: "45 min",
    difficulty: "Medium",
    servings: 6,
    description: "Crispy rolls filled with vegetables",
    ingredients: [
      "🍜 Spring roll wrappers",
      "🥬 2 cups cabbage, shredded",
      "🥕 1 carrot, julienned",
      "🍄 1/2 cup mushrooms",
      "🧅 Spring onions",
      "🧄 Ginger-garlic paste",
      "🥫 Soy sauce",
      "🌽 Cornflour slurry",
      "🥄 Oil for frying"
    ],
    instructions: [
      "Stir-fry vegetables with ginger-garlic",
      "Season with soy sauce and pepper",
      "Thicken with cornflour slurry",
      "Let filling cool completely",
      "Place filling on wrapper, fold sides",
      "Roll tightly and seal with flour paste",
      "Deep fry until golden and crispy",
      "Serve with sweet chili sauce"
    ]
  },

  // ITALIAN DISHES
  {
    id: 11,
    name: "Margherita Pizza",
    category: "italian",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    prepTime: "120 min",
    difficulty: "Medium",
    servings: 2,
    description: "Classic pizza with tomato, mozzarella, basil",
    ingredients: [
      "🍞 2 cups all-purpose flour",
      "🧂 1 tsp yeast",
      "🍅 1 cup tomato sauce",
      "🧀 200g mozzarella cheese",
      "🌿 Fresh basil leaves",
      "🫒 2 tbsp olive oil",
      "🧂 Salt, sugar",
      "🧄 2 cloves garlic"
    ],
    instructions: [
      "Make pizza dough with flour, yeast, water",
      "Let dough rise for 1-2 hours",
      "Roll into thin circles",
      "Spread tomato sauce evenly",
      "Add torn mozzarella cheese",
      "Drizzle with olive oil",
      "Bake at 220°C for 12-15 minutes",
      "Garnish with fresh basil"
    ]
  },
  {
    id: 12,
    name: "Pasta Carbonara",
    category: "italian",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500",
    prepTime: "25 min",
    difficulty: "Medium",
    servings: 3,
    description: "Creamy pasta with bacon and eggs",
    ingredients: [
      "🍝 300g spaghetti",
      "🥓 150g bacon/pancetta",
      "🥚 3 egg yolks",
      "🧀 1 cup parmesan cheese",
      "🧄 3 cloves garlic",
      "🌶️ Black pepper",
      "🧂 Salt",
      "🫒 Olive oil"
    ],
    instructions: [
      "Cook spaghetti in salted boiling water",
      "Fry bacon until crispy",
      "Mix egg yolks with parmesan cheese",
      "Drain pasta, reserve 1 cup pasta water",
      "Add hot pasta to bacon pan",
      "Remove from heat, add egg mixture",
      "Toss quickly, add pasta water if needed",
      "Season with black pepper"
    ]
  },
  {
    id: 13,
    name: "Lasagna",
    category: "italian",
    image: "https://images.unsplash.com/photo-1619895092538-128341789043?w=500",
    prepTime: "90 min",
    difficulty: "Hard",
    servings: 6,
    description: "Layered pasta with meat sauce and cheese",
    ingredients: [
      "🍝 12 lasagna sheets",
      "🥩 500g ground beef",
      "🍅 2 cups tomato sauce",
      "🧀 300g mozzarella",
      "🧀 1 cup parmesan",
      "🥛 2 cups white sauce",
      "🧅 1 onion",
      "🧄 4 cloves garlic",
      "🌿 Italian herbs"
    ],
    instructions: [
      "Prepare meat sauce with beef, tomatoes, herbs",
      "Make white sauce (béchamel)",
      "Cook lasagna sheets until al dente",
      "Layer: meat sauce, pasta, white sauce, cheese",
      "Repeat layers 3-4 times",
      "Top with extra cheese",
      "Bake at 180°C for 40 minutes",
      "Let rest 10 minutes before serving"
    ]
  },
  {
    id: 14,
    name: "Risotto",
    category: "italian",
    image: "https://images.unsplash.com/photo-1595908129746-34d2c1c1e3c1?w=500",
    prepTime: "35 min",
    difficulty: "Medium",
    servings: 4,
    description: "Creamy Italian rice dish",
    ingredients: [
      "🍚 2 cups arborio rice",
      "🧅 1 onion, diced",
      "🧄 2 cloves garlic",
      "🍷 1/2 cup white wine",
      "🥣 6 cups vegetable stock",
      "🧀 1/2 cup parmesan",
      "🧈 3 tbsp butter",
      "🍄 Mushrooms (optional)",
      "🌿 Fresh parsley"
    ],
    instructions: [
      "Heat stock in separate pot",
      "Sauté onion and garlic in butter",
      "Add rice, toast for 2 minutes",
      "Add wine, let it absorb",
      "Add hot stock one ladle at a time",
      "Stir constantly until creamy",
      "Finish with butter and parmesan",
      "Garnish with parsley"
    ]
  },
  {
    id: 15,
    name: "Tiramisu",
    category: "italian",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
    prepTime: "30 min",
    difficulty: "Easy",
    servings: 6,
    description: "Classic Italian coffee-flavored dessert",
    ingredients: [
      "🍪 300g ladyfinger biscuits",
      "☕ 2 cups strong coffee",
      "🧀 500g mascarpone cheese",
      "🥚 4 eggs",
      "🍯 1/2 cup sugar",
      "🍫 Cocoa powder",
      "🥃 2 tbsp coffee liqueur (optional)"
    ],
    instructions: [
      "Separate eggs, beat yolks with sugar",
      "Mix in mascarpone cheese",
      "Whip egg whites until stiff peaks",
      "Fold into mascarpone mixture",
      "Dip ladyfingers in coffee briefly",
      "Layer biscuits and cream in dish",
      "Repeat layers, ending with cream",
      "Dust with cocoa powder, refrigerate 4 hours"
    ]
  },

  // WESTERN DISHES
  {
    id: 16,
    name: "Classic Burger",
    category: "western",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    prepTime: "30 min",
    difficulty: "Easy",
    servings: 4,
    description: "Juicy beef burger with all the fixings",
    ingredients: [
      "🥩 500g ground beef",
      "🍞 4 burger buns",
      "🧀 4 cheese slices",
      "🍅 2 tomatoes, sliced",
      "🥬 Lettuce leaves",
      "🧅 1 onion, sliced",
      "🥒 Pickles",
      "🍅 Ketchup, mustard, mayo",
      "🧂 Salt, pepper"
    ],
    instructions: [
      "Form beef into 4 patties, season well",
      "Grill or pan-fry patties 4 mins each side",
      "Add cheese on top to melt",
      "Toast burger buns lightly",
      "Spread sauces on buns",
      "Layer: lettuce, patty, tomato, onion, pickles",
      "Top with bun half",
      "Serve with fries"
    ]
  },
  {
    id: 17,
    name: "Chicken Wings",
    category: "western",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500",
    prepTime: "45 min",
    difficulty: "Easy",
    servings: 4,
    description: "Crispy baked chicken wings with sauce",
    ingredients: [
      "🍗 1kg chicken wings",
      "🌶️ Hot sauce",
      "🧈 4 tbsp butter",
      "🧄 2 cloves garlic",
      "🍯 2 tbsp honey",
      "🥫 Soy sauce",
      "🌽 2 tbsp cornstarch",
      "🧂 Salt, pepper, paprika"
    ],
    instructions: [
      "Pat wings dry, season with salt and pepper",
      "Coat with cornstarch",
      "Bake at 200°C for 40 minutes, turning halfway",
      "Melt butter, add hot sauce, honey, garlic",
      "Toss baked wings in sauce",
      "Return to oven for 5 minutes",
      "Serve hot with ranch or blue cheese dip"
    ]
  },
  {
    id: 18,
    name: "Mac and Cheese",
    category: "western",
    image: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=500",
    prepTime: "30 min",
    difficulty: "Easy",
    servings: 4,
    description: "Creamy cheesy macaroni pasta",
    ingredients: [
      "🍝 300g macaroni pasta",
      "🧀 2 cups cheddar cheese",
      "🥛 2 cups milk",
      "🧈 3 tbsp butter",
      "🍞 2 tbsp flour",
      "🧂 Salt, pepper",
      "🌶️ Paprika",
      "🍞 Breadcrumbs for topping"
    ],
    instructions: [
      "Cook macaroni until al dente",
      "Make roux with butter and flour",
      "Gradually add milk, whisking constantly",
      "Add cheese, stir until melted",
      "Mix in cooked pasta",
      "Transfer to baking dish",
      "Top with breadcrumbs and extra cheese",
      "Bake at 180°C for 20 minutes"
    ]
  },
  {
    id: 19,
    name: "BBQ Ribs",
    category: "western",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
    prepTime: "180 min",
    difficulty: "Hard",
    servings: 4,
    description: "Tender fall-off-the-bone BBQ ribs",
    ingredients: [
      "🥩 1.5kg pork ribs",
      "🍅 1 cup BBQ sauce",
      "🍯 3 tbsp honey",
      "🧄 4 cloves garlic",
      "🌶️ Paprika, chili powder",
      "🧂 Salt, pepper",
      "🥫 Worcestershire sauce",
      "🍋 Lemon juice"
    ],
    instructions: [
      "Remove membrane from ribs",
      "Make dry rub with spices",
      "Coat ribs generously with rub",
      "Wrap in foil, bake at 150°C for 2.5 hours",
      "Mix BBQ sauce with honey",
      "Unwrap ribs, brush with sauce",
      "Grill or broil for 10 minutes",
      "Baste with more sauce and serve"
    ]
  },
  {
    id: 20,
    name: "Pancakes",
    category: "western",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: 4,
    description: "Fluffy American-style pancakes",
    ingredients: [
      "🍞 2 cups all-purpose flour",
      "🥚 2 eggs",
      "🥛 1.5 cups milk",
      "🧈 3 tbsp melted butter",
      "🍯 2 tbsp sugar",
      "🧂 1 tsp salt",
      "🥄 2 tsp baking powder",
      "🍯 Maple syrup for serving"
    ],
    instructions: [
      "Mix flour, sugar, baking powder, salt",
      "Whisk eggs, milk, and melted butter separately",
      "Combine wet and dry ingredients",
      "Don't overmix, some lumps are okay",
      "Heat griddle or pan on medium",
      "Pour 1/4 cup batter per pancake",
      "Flip when bubbles appear",
      "Serve with butter and maple syrup"
    ]
  }
];

// Daily Dishes - Rotates based on day of the week
const dailyDishes = [
  [1, 6, 11, 16],  // Sunday
  [2, 7, 12, 17],  // Monday
  [3, 8, 13, 18],  // Tuesday
  [4, 9, 14, 19],  // Wednesday
  [5, 10, 15, 20], // Thursday
  [1, 8, 12, 19],  // Friday
  [3, 7, 14, 16]   // Saturday
];

// Get today's featured dishes
function getTodaysDishes() {
  const today = new Date().getDay();
  const dishIds = dailyDishes[today];
  return dishIds.map(id => recipesDatabase.find(recipe => recipe.id === id));
}
