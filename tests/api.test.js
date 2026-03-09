const request = require('supertest');
const app = require('../index');

describe('Rayeva AI System - API Tests', () => {
  // Test data
  const validCategoryInput = {
    product_name: 'Eco-Friendly Bamboo Toothbrush',
    description: 'A sustainable bamboo toothbrush with biodegradable bristles, packaged in compostable materials.',
  };

  const validImpactInput = {
    product: 'Eco-Friendly Bamboo Toothbrush',
    quantity: 5,
  };

  // Health Check Tests
  describe('Health Check', () => {
    test('GET /api/health should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('Rayeva AI System');
    });
  });

  // Category API Tests
  describe('Category Generator API', () => {
    test('POST /api/category should accept valid product data', async () => {
      const response = await request(app)
        .post('/api/category')
        .send(validCategoryInput)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    test('POST /api/category should reject missing product_name', async () => {
      const response = await request(app)
        .post('/api/category')
        .send({
          description: 'Test description',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    test('POST /api/category should reject missing description', async () => {
      const response = await request(app)
        .post('/api/category')
        .send({
          product_name: 'Test Product',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    test('POST /api/category response should contain required fields', async () => {
      const response = await request(app)
        .post('/api/category')
        .send(validCategoryInput)
        .expect(201);

      expect(response.body.data.product_name).toBeDefined();
      expect(response.body.data.category).toBeDefined();
      expect(response.body.data.subcategory).toBeDefined();
      expect(response.body.data.tags).toBeDefined();
      expect(response.body.data.sustainability_filters).toBeDefined();
      expect(Array.isArray(response.body.data.tags)).toBe(true);
    });

    test('POST /api/category tags should have minimum 5 tags', async () => {
      const response = await request(app)
        .post('/api/category')
        .send(validCategoryInput)
        .expect(201);

      expect(response.body.data.tags.length).toBeGreaterThanOrEqual(5);
    });

    test('GET /api/category/:productId should return 404 for invalid ID', async () => {
      const response = await request(app)
        .get('/api/category/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // Impact API Tests
  describe('Impact Report Generator API', () => {
    test('POST /api/impact should accept valid order data', async () => {
      const response = await request(app)
        .post('/api/impact')
        .send(validImpactInput)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    test('POST /api/impact should reject missing product', async () => {
      const response = await request(app)
        .post('/api/impact')
        .send({
          quantity: 5,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    test('POST /api/impact should reject missing quantity', async () => {
      const response = await request(app)
        .post('/api/impact')
        .send({
          product: 'Test Product',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    test('POST /api/impact should reject non-positive quantity', async () => {
      const response = await request(app)
        .post('/api/impact')
        .send({
          product: 'Test Product',
          quantity: -5,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('POST /api/impact response should contain impact metrics', async () => {
      const response = await request(app)
        .post('/api/impact')
        .send(validImpactInput)
        .expect(201);

      expect(response.body.data.order_id).toBeDefined();
      expect(response.body.data.product).toBe(validImpactInput.product);
      expect(response.body.data.quantity).toBe(validImpactInput.quantity);
      expect(response.body.data.impact_metrics).toBeDefined();
      expect(response.body.data.impact_metrics.plastic_saved_grams).toBeDefined();
      expect(response.body.data.impact_metrics.carbon_avoided_kg).toBeDefined();
    });

    test('POST /api/impact should calculate correct impact for 5 toothbrushes', async () => {
      const response = await request(app)
        .post('/api/impact')
        .send(validImpactInput)
        .expect(201);

      // 5 toothbrushes × 20 grams = 100 grams
      expect(response.body.data.impact_metrics.plastic_saved_grams).toBe(100);
      // 5 toothbrushes × 0.05 kg CO2 = 0.25 kg CO2
      expect(response.body.data.impact_metrics.carbon_avoided_kg).toBe(0.25);
    });

    test('POST /api/impact response should contain summaries', async () => {
      const response = await request(app)
        .post('/api/impact')
        .send(validImpactInput)
        .expect(201);

      expect(response.body.data.local_sourcing).toBeDefined();
      expect(typeof response.body.data.local_sourcing).toBe('string');
      expect(response.body.data.impact_statement).toBeDefined();
      expect(typeof response.body.data.impact_statement).toBe('string');
    });

    test('GET /api/impact/:orderId should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/impact/ORD-nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    test('404 for unknown endpoint', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Endpoint not found');
    });

    test('POST request with invalid JSON should be handled', async () => {
      const response = await request(app)
        .post('/api/category')
        .send('invalid json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
