class PromptBuilder {
  /**
   * Build prompt for category generation
   * @param {object} product - Product data
   * @returns {string} - Formatted prompt
   */
  static buildCategoryPrompt(product) {
    return `You are an expert in sustainability and e-commerce product categorization.

Analyze the following product and generate a JSON response with ONLY this exact structure, no other text:

Product Name: "${product.product_name}"
Product Description: "${product.description}"

Generate ONLY valid JSON with this exact structure:
{
  "category": "primary category name",
  "subcategory": "subcategory name",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "filters": ["filter1", "filter2"]
}

Requirements:
- category: Must be from: Personal Care, Household, Food & Beverage, Fashion, Home & Garden
- subcategory: Must be relevant to the category
- tags: Generate 5-10 SEO-friendly tags (lowercase, hyphenated)
- filters: Choose from: plastic-free, biodegradable, compostable, vegan, cruelty-free, organic, fair-trade, recycled-materials, carbon-neutral, zero-waste, locally-sourced, reusable

Respond ONLY with the JSON object, nothing else.`;
  }

  /**
   * Build prompt for impact reporting
   * @param {object} order - Order data
   * @returns {string} - Formatted prompt
   */
  static buildImpactPrompt(order) {
    const impact = order.calculatedImpact || {};
    
    return `You are an expert in sustainability impact reporting for e-commerce.

Generate a comprehensive impact report for the following purchase:

Product: "${order.product}"
Quantity: ${order.quantity}
Plastic Saved: ${impact.plastic_saved_grams || 0} grams
Carbon Avoided: ${impact.carbon_avoided_kg || 0} kg CO2

Generate ONLY valid JSON with this exact structure:
{
  "local_sourcing_summary": "A brief statement about local sourcing (1-2 sentences)",
  "impact_statement": "An inspiring statement about the environmental impact (2-3 sentences)"
}

Requirements:
- local_sourcing_summary: Professional, factual statement about the product's sourcing
- impact_statement: Motivational message about the positive impact of this purchase

Respond ONLY with the JSON object, nothing else.`;
  }

  /**
   * Build prompt for tag generation
   * @param {object} product - Product data
   * @returns {string} - Formatted prompt
   */
  static buildTagPrompt(product) {
    return `Generate 8-10 relevant SEO tags for this product:

Product Name: "${product.product_name}"
Category: "${product.category}"
Description: "${product.description}"

Generate ONLY valid JSON with this exact structure:
{
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"]
}

Requirements:
- Tags should be lowercase, hyphenated, SEO-friendly
- Tags should relate to sustainability and the product category
- Each tag should be 2-4 words

Respond ONLY with the JSON object, nothing else.`;
  }
}

module.exports = PromptBuilder;
