// Sustainability Impact Constants
const IMPACT_CONSTANTS = {
  // Plastic toothbrush impact
  PLASTIC_TOOTHBRUSH_WEIGHT_GRAMS: 20,
  CARBON_PER_PLASTIC_TOOTHBRUSH_KG: 0.05,

  // Common product weights (in grams)
  PLASTIC_BOTTLE_WEIGHT: 42,
  PLASTIC_BAG_WEIGHT: 5,
  PLASTIC_WRAP_WEIGHT: 2,

  // Carbon emissions (kg CO2 per unit)
  CARBON_PER_PLASTIC_BOTTLE: 0.08,
  CARBON_PER_PLASTIC_BAG: 0.01,
  CARBON_PER_PLASTIC_WRAP: 0.005,
};

// Supported sustainability filters
const SUSTAINABILITY_FILTERS = [
  'plastic-free',
  'biodegradable',
  'compostable',
  'vegan',
  'cruelty-free',
  'organic',
  'fair-trade',
  'recycled-materials',
  'carbon-neutral',
  'zero-waste',
  'locally-sourced',
  'reusable',
];

// Product categories for validation
const PRODUCT_CATEGORIES = {
  'Personal Care': {
    subcategories: ['Oral Care', 'Hair Care', 'Skin Care', 'Deodorant', 'Other'],
  },
  'Household': {
    subcategories: ['Cleaning', 'Laundry', 'Kitchen', 'Storage', 'Other'],
  },
  'Food & Beverage': {
    subcategories: ['Snacks', 'Beverages', 'Condiments', 'Supplements', 'Other'],
  },
  'Fashion': {
    subcategories: ['Clothing', 'Accessories', 'Footwear', 'Bags', 'Other'],
  },
  'Home & Garden': {
    subcategories: ['Furniture', 'Decor', 'Gardening', 'Bedding', 'Other'],
  },
};

// API Response Status Codes
const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

module.exports = {
  IMPACT_CONSTANTS,
  SUSTAINABILITY_FILTERS,
  PRODUCT_CATEGORIES,
  API_STATUS,
};
