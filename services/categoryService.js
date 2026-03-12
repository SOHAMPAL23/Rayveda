const openaiClient = require('../lib/openaiClient');
const PromptBuilder = require('../lib/promptBuilder');
const JSONValidator = require('../lib/jsonValidator');
const { pool } = require('../config/db');

class CategoryService {
  /**
   * AI-powered product categorization
   * @param {object} productData - Product information (product_name, description)
   * @returns {object} - Categorization report
   */
  async generateCategoryReport(productData) {
    let aiResponse = null;
    let promptContent = null;
    let validatedInput = null;

    try {
      // 1. Business Logic Validation
      validatedInput = JSONValidator.validateInput(productData, 'category');

      // 2. Build Prompt
      promptContent = PromptBuilder.buildCategoryPrompt(validatedInput);

      // 3. AI Service Interaction
      aiResponse = await openaiClient.callAPI(promptContent, {
        maxRetries: 1, // Let client handle its own retry
        temperature: 0.3,
        max_tokens: 500,
      });

      // 4. Validate AI Structured Output
      const parsedAIJSON = JSONValidator.parseJSON(aiResponse.content);
      const categoryData = JSONValidator.validateCategoryResponse(parsedAIJSON);

      // 5. Success Logging + Result Storage
      const savedRecord = await this.saveCategoryReport(validatedInput, categoryData, parsedAIJSON);
      await this.logInteraction('ai-categorization', promptContent, parsedAIJSON, aiResponse, true);

      return {
        ...categoryData,
        id: savedRecord.id,
      };
    } catch (error) {
      console.error(`[Category Report Service Error]: ${error.message}`);

      // 6. Detailed Error Logging
      if (promptContent) {
        await this.logInteraction('ai-categorization', promptContent, null,
          { processingTimeMs: 0, model: openaiClient.model, attempt: 0 }, false, error.message);
      }

      throw error;
    }
  }

  /**
   * Store category report in its dedicated table
   */
  async saveCategoryReport(productData, categoryData, raw) {
    try {
      const query = `
        INSERT INTO ai_category_reports (product_name, description, category, subcategory, tags, sustainability_filters, raw_ai_response)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;

      const values = [
        productData.product_name,
        productData.description,
        categoryData.category,
        categoryData.subcategory,
        categoryData.tags,
        categoryData.filters,
        JSON.stringify(raw)
      ];

      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (error) {
      console.error(`[Save Category Report Error]: ${error.message}`);
      // Fallback but log it
      return { id: `temp-cat-${Date.now()}`, ...productData, ...categoryData };
    }
  }

  /**
   * Universal Prompt + Response Logging
   */
  async logInteraction(moduleName, promptContent, responseContent, aiRes, success, errorMsg = null) {
    try {
      const query = `
        INSERT INTO ai_interaction_logs (module_name, prompt_content, response_content, processing_time_ms, success, error_message, model_used, retry_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `;

      const values = [
        moduleName,
        promptContent,
        responseContent ? JSON.stringify(responseContent) : null,
        aiRes.processingTimeMs || 0,
        success,
        errorMsg,
        aiRes.model,
        aiRes.attempt - 1
      ];

      await pool.query(query, values);
    } catch (dbError) {
      console.error(`[Log Interaction Error]: ${dbError.message}`);
    }
  }
}

module.exports = new CategoryService();
