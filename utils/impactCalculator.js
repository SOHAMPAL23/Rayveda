const { IMPACT_CONSTANTS } = require('./constants');

class ImpactCalculator {
  /**
   * Calculate impact for plastic toothbrush
   * @param {number} quantity - Number of items
   * @returns {object} - Impact metrics
   */
  static calculatePlasticToothbrushImpact(quantity) {
    const plasticSavedGrams = quantity * IMPACT_CONSTANTS.PLASTIC_TOOTHBRUSH_WEIGHT_GRAMS;
    const carbonAvoidedKg = quantity * IMPACT_CONSTANTS.CARBON_PER_PLASTIC_TOOTHBRUSH_KG;

    return {
      plastic_saved_grams: Math.round(plasticSavedGrams * 100) / 100,
      carbon_avoided_kg: Math.round(carbonAvoidedKg * 1000) / 1000,
    };
  }

  /**
   * Calculate impact for plastic bottle
   * @param {number} quantity - Number of items
   * @returns {object} - Impact metrics
   */
  static calculatePlasticBottleImpact(quantity) {
    const plasticSavedGrams = quantity * IMPACT_CONSTANTS.PLASTIC_BOTTLE_WEIGHT;
    const carbonAvoidedKg = quantity * IMPACT_CONSTANTS.CARBON_PER_PLASTIC_BOTTLE;

    return {
      plastic_saved_grams: Math.round(plasticSavedGrams * 100) / 100,
      carbon_avoided_kg: Math.round(carbonAvoidedKg * 1000) / 1000,
    };
  }

  /**
   * Generate impact summary text
   * @param {object} impact - Impact metrics
   * @param {string} productName - Name of the product
   * @returns {string} - Impact summary
   */
  static generateImpactSummary(impact, productName) {
    const plasticKg = (impact.plastic_saved_grams / 1000).toFixed(2);
    const carbon = impact.carbon_avoided_kg.toFixed(3);

    return `By choosing sustainable ${productName}, you've saved ${plasticKg} kg of plastic from landfills and avoided ${carbon} kg of CO2 emissions.`;
  }

  /**
   * Generate local sourcing summary
   * @param {string} category - Product category
   * @returns {string} - Sourcing summary
   */
  static generateLocalSourcingSummary(category) {
    const summaries = {
      'Oral Care': 'This product is locally manufactured in partnership with certified sustainable suppliers.',
      'Personal Care': 'Sourced from fair-trade certified producers in your region.',
      'Household': 'Manufactured using locally-sourced renewable materials.',
      'Food & Beverage': 'Sourced from local organic farms and suppliers.',
      'Fashion': 'Ethically produced by local artisans and fair-trade certified manufacturers.',
      'Home & Garden': 'Crafted from locally-harvested and sustainably-managed materials.',
    };

    return summaries[category] || 'Sourced with environmental and social responsibility in mind.';
  }
}

module.exports = ImpactCalculator;
