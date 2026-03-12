const { OpenAI } = require('openai');
require('dotenv').config();

class OpenAIClient {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  /**
   * Call OpenAI API with structured JSON response_format
   * @param {string} prompt - The prompt to send
   * @param {object} options - Additional options (maxRetries, temperature, etc)
   * @returns {object} - Standardized API response
   */
  async callAPI(prompt, options = {}) {
    const maxRetries = options.maxRetries || 3;
    const temperature = options.temperature || 0.7;
    const max_tokens = options.max_tokens || 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const startTime = Date.now();

        // Using response_format to ensure strict structured output
        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a precise AI assistant. You MUST respond with valid JSON ONLY. No preamble, no conversational text.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature,
          max_tokens,
          response_format: { type: "json_object" } // Enforce structured output
        });

        const processingTimeMs = Date.now() - startTime;

        return {
          success: true,
          content: response.choices[0].message.content,
          processingTimeMs,
          model: this.model,
          attempt: attempt + 1,
        };
      } catch (error) {
        console.error(`[OpenAI API Attempt ${attempt + 1}/${maxRetries}]: ${error.message}`);

        if (attempt === maxRetries - 1) {
          throw new Error(`OpenAI API failed after ${maxRetries} attempts: ${error.message}`);
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
}

module.exports = new OpenAIClient();
