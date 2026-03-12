const express = require('express');
const categoryService = require('../services/categoryService');
const { AppError } = require('../utils/errorHandler');

const router = express.Router();

/**
 * POST /api/category
 * Generate and store product categorization report using AI
 */
router.post('/', async (req, res, next) => {
  try {
    const { product_name, description } = req.body;

    // Call service to generate (Service handles validation, AI call, Logging, and AI-specific DB storage)
    const categoryData = await categoryService.generateCategoryReport({
      product_name,
      description,
    });

    // Return response
    res.status(201).json({
      success: true,
      data: {
        product_id: categoryData.id,
        product_name: product_name,
        category: categoryData.category,
        subcategory: categoryData.subcategory,
        tags: categoryData.tags,
        sustainability_filters: categoryData.filters,
        generated_at: new Date(),
      },
    });
  } catch (error) {
    // If AI fails (e.g. 429 quota), return a structured fallback
    if (error.message.includes('quota') || error.message.includes('429')) {
      console.warn('[AI Quota/Rate Limit]: Returning local logic fallback for Category');

      const fallbackData = {
        category: 'Sustainable Goods',
        subcategory: 'General Eco-Products',
        tags: ['eco-friendly', 'sustainable', 'automatic-match'],
        filters: ['plastic-free']
      };

      return res.status(201).json({
        success: true,
        data: {
          product_id: `fallback-${Date.now()}`,
          product_name: req.body.product_name,
          ...fallbackData,
          sustainability_filters: fallbackData.filters,
          note: 'Using local logic due to AI service quota'
        }
      });
    }
    next(error);
  }
});

module.exports = router;
