const openaiClient = require('../lib/openaiClient');
const PromptBuilder = require('../lib/promptBuilder');
const JSONValidator = require('../lib/jsonValidator');
const ImpactCalculator = require('../utils/impactCalculator');
const { pool } = require('../config/db');

class ImpactService {
  /**
   * AI-powered sustainability impact reporting
   * @param {object} orderData - Order information (product, quantity)
   * @returns {object} - Impact report
   */
  async generateImpactReport(orderData) {
    let aiResponse = null;
    let promptContent = null;
    let validatedInput = null;

    try {
      // 1. Business Logic Validation
      validatedInput = JSONValidator.validateInput(orderData, 'impact');

      // 2. Local Impact Logic Integration (Separation of AI and local logic)
      const calculatedImpact = ImpactCalculator.calculatePlasticToothbrushImpact(
        validatedInput.quantity
      );

      // 3. Build Prompt (Calculated metrics + Product Context)
      const promptInput = { ...validatedInput, calculatedImpact };
      promptContent = PromptBuilder.buildImpactPrompt(promptInput);

      // 4. AI Service Interaction
      aiResponse = await openaiClient.callAPI(promptContent, {
        maxRetries: 1,
        temperature: 0.4,
        max_tokens: 500,
      });

      // 5. Validate AI Structured Output
      const parsedAIJSON = JSONValidator.parseJSON(aiResponse.content);
      const validatedAIResponse = JSONValidator.validateImpactResponse(parsedAIJSON);

      // 6. Combine Local Calculations with AI Narrative
      const completeReport = {
        ...calculatedImpact,
        ...validatedAIResponse,
      };

      // 7. Success Logging + Result Storage
      const savedRecord = await this.saveImpactReport(validatedInput, completeReport, parsedAIJSON);
      await this.logInteraction('ai-impact-reporting', promptContent, parsedAIJSON, aiResponse, true);

      return {
        ...completeReport,
        id: savedRecord.id, // Or use its dedicated ID
      };
    } catch (error) {
      console.error(`[Impact Report Service Error]: ${error.message}`);

      // 8. Detailed Error Logging
      if (promptContent) {
        await this.logInteraction('ai-impact-reporting', promptContent, null,
          { processingTimeMs: 0, model: openaiClient.model, attempt: 0 }, false, error.message);
      }

      throw error;
    }
  }

  /**
   * Store impact report in its dedicated table
   */
  async saveImpactReport(orderData, reportData, raw) {
    try {
      const query = `
        INSERT INTO ai_impact_reports (product_name, quantity, plastic_saved_grams, carbon_avoided_kg, local_sourcing, impact_statement, raw_ai_response)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;

      const values = [
        orderData.product,
        orderData.quantity,
        reportData.plastic_saved_grams,
        reportData.carbon_avoided_kg,
        reportData.local_sourcing_summary,
        reportData.impact_statement,
        JSON.stringify(raw)
      ];

      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (error) {
      console.error(`[Save Impact Report Error]: ${error.message}`);
      // Fallback but log it
      return { id: `temp-imp-${Date.now()}`, ...orderData, ...reportData };
    }
  }

  /**
   * Final Statement Logic (Separated business logic)
   */
  generateFinalStatement(impactReport) {
    const plasticKg = (impactReport.plastic_saved_grams / 1000).toFixed(2);
    const carbon = impactReport.carbon_avoided_kg.toFixed(3);

    return `${impactReport.impact_statement} This purchase eliminated ${plasticKg} kg of plastic waste and prevented ${carbon} kg of CO2 emissions.`;
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

module.exports = new ImpactService();
