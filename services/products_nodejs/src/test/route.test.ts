
import request from 'supertest';
import express, { Request, Response } from 'express';
const app = express();
import assert from 'assert';

app.use(express.json());


describe('Product Routes', () => {
  it('should create a new product', async () => {
    const newProduct = {
      title: 'Test Product',
      price: 19.99,
      description: 'A test product for unit testing',
    };

    const response = await request(app)
      .post('/create')
      .send(newProduct)
      .expect(200);

    assert.deepStrictEqual(response.body.title, newProduct.title);
    assert.deepStrictEqual(response.body.price, newProduct.price);
    assert.deepStrictEqual(response.body.description, newProduct.description);
  });

  it('should handle errors when creating a product', async () => {
    const invalidProduct = {
      title: 'Invalid Product',
      price: 'not a number', // intentionally providing an invalid price
      description: 'An invalid product for testing error handling',
    };

    const response = await request(app)
      .post('/create')
      .send(invalidProduct)
      .expect(500);

    assert(response.body.error);
  });
});