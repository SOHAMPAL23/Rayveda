const express = require('express');
const impactService = require('../services/impactService');
const { AppError } = require('../utils/errorHandler');

const router = express.Router();

/**
 * POST /api/impact
 * Generate and store product impact report using AI
 */
router.post('/', async (req, res, next) => {
  try {
    const { product, quantity } = req.body;

    // Call service to generate (Unified pipeline: Validation -> Calculation -> AI Call -> Structured Logging -> DB)
    const impactReport = await impactService.generateImpactReport({
      product,
      quantity,
    });

    // Business Logic Narrative (Separated)
    const finalStatement = impactService.generateFinalStatement(impactReport);

    // Return response
    res.status(201).json({
      success: true,
      data: {
        order_id: impactReport.id,
        product: product,
        quantity: quantity,
        impact_metrics: {
          plastic_saved_grams: impactReport.plastic_saved_grams,
          carbon_avoided_kg: impactReport.carbon_avoided_kg,
        },
        local_sourcing: impactReport.local_sourcing_summary,
        impact_statement: finalStatement,
        generated_at: new Date(),
      },
    });
  } catch (error) {
    // If AI fails (e.g. 429 quota), return a structured fallback
    if (error.message.includes('quota') || error.message.includes('rate limit') || error.message.includes('429')) {
      console.warn('[AI Quota/Rate Limit]: Returning local logic fallback for Impact');

      const plastic_saved = (req.body.quantity || 1) * 20;
      const carbon_avoided = (req.body.quantity || 1) * 0.05;

      return res.status(201).json({
        success: true,
        data: {
          order_id: `fallback-ORD-${Date.now()}`,
          product: req.body.product,
          quantity: req.body.quantity,
          impact_metrics: {
            plastic_saved_grams: plastic_saved,
            carbon_avoided_kg: carbon_avoided,
          },
          local_sourcing: 'Locally sourced from verified sustainable partners',
          impact_statement: `Thank you for choosing sustainability! Your purchase helped save ${plastic_saved}g of plastic. (Local Calculation Fallback)`,
          note: 'Using local logic due to AI service quota'
        }
      });
    }
    next(error);
  }
});

module.exports = router;
