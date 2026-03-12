const Joi = require('joi');

class JSONValidator {
  /**
   * Validate and parse JSON string
   * @param {string} jsonString - JSON string to validate
   * @returns {object} - Parsed JSON object
   */
  static parseJSON(jsonString) {
    try {
      const json = JSON.parse(jsonString);
      return json;
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
  }

  /**
   * Validate category AI response
   * @param {object} data - Data to validate
   * @returns {object} - Validated data
   */
  static validateCategoryResponse(data) {
    const schema = Joi.object({
      category: Joi.string().required().messages({
        'string.empty': 'Category cannot be empty',
        'any.required': 'Category is required',
      }),
      subcategory: Joi.string().required().messages({
        'string.empty': 'Subcategory cannot be empty',
        'any.required': 'Subcategory is required',
      }),
      tags: Joi.array()
        .items(Joi.string())
        .min(5)
        .max(10)
        .required()
        .messages({
          'array.min': 'Must have at least 5 tags',
          'array.max': 'Cannot have more than 10 tags',
          'any.required': 'Tags array is required',
        }),
      filters: Joi.array()
        .items(Joi.string())
        .required()
        .messages({
          'any.required': 'Filters array is required',
        }),
    });

    const { error, value } = schema.validate(data);

    if (error) {
      throw new Error(`Validation failed: ${error.details.map((d) => d.message).join(', ')}`);
    }

    return value;
  }

  /**
   * Validate impact report response
   * @param {object} data - Data to validate
   * @returns {object} - Validated data
   */
  static validateImpactResponse(data) {
    const schema = Joi.object({
      plastic_saved_grams: Joi.number().required().messages({
        'number.base': 'plastic_saved_grams must be a number',
        'any.required': 'plastic_saved_grams is required',
      }),
      carbon_avoided_kg: Joi.number().required().messages({
        'number.base': 'carbon_avoided_kg must be a number',
        'any.required': 'carbon_avoided_kg is required',
      }),
      local_sourcing_summary: Joi.string().required().messages({
        'string.empty': 'local_sourcing_summary cannot be empty',
        'any.required': 'local_sourcing_summary is required',
      }),
      impact_statement: Joi.string().required().messages({
        'string.empty': 'impact_statement cannot be empty',
        'any.required': 'impact_statement is required',
      }),
    });

    const { error, value } = schema.validate(data);

    if (error) {
      throw new Error(`Validation failed: ${error.details.map((d) => d.message).join(', ')}`);
    }

    return value;
  }

  /**
   * Validate API input
   * @param {object} data - Data to validate
   * @param {string} type - Type of validation (category, impact)
   * @returns {object} - Validated data
   */
  static validateInput(data, type) {
    let schema;

    switch (type) {
      case 'category':
        schema = Joi.object({
          product_name: Joi.string().required().messages({
            'string.empty': 'product_name cannot be empty',
            'any.required': 'product_name is required',
          }),
          description: Joi.string().required().messages({
            'string.empty': 'description cannot be empty',
            'any.required': 'description is required',
          }),
        });
        break;

      case 'impact':
        schema = Joi.object({
          product: Joi.string().required().messages({
            'string.empty': 'product cannot be empty',
            'any.required': 'product is required',
          }),
          quantity: Joi.number().integer().positive().required().messages({
            'number.base': 'quantity must be a number',
            'number.positive': 'quantity must be positive',
            'any.required': 'quantity is required',
          }),
        });
        break;

      default:
        throw new Error(`Unknown validation type: ${type}`);
    }

    const { error, value } = schema.validate(data);

    if (error) {
      throw new Error(`Input validation failed: ${error.details.map((d) => d.message).join(', ')}`);
    }

    return value;
  }
}

module.exports = JSONValidator;
