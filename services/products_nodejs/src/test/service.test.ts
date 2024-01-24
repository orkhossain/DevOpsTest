import {createProduct} from '../products/products.service' 
import assert from 'assert';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Product Service', () => {
  beforeEach(async () => {
    // Clear the product table before each test
    await prisma.product.deleteMany();
  });

  afterEach(async () => {
    // Disconnect Prisma after each test
    await prisma.$disconnect();
  });

  it('should create a new product', async () => {
    const newProduct = {
      title: 'Test Product',
      price: 19.99,
      description: 'A test product for unit testing',
    };

    const createdProduct = await createProduct(newProduct);

    // assert.deepStrictEqual(createdProduct.title, newProduct.title);
    // assert.deepStrictEqual(createdProduct.price, newProduct.price);
    // assert.deepStrictEqual(createdProduct.description, newProduct.description);

    // Verify the product is stored in the database
    const storedProduct = await prisma.product.findUnique({
      where: { id: createdProduct.id },
    });

    assert(storedProduct);
    // assert.deepStrictEqual(storedProduct!.title, newProduct.title);
    // assert.deepStrictEqual(storedProduct!.price, newProduct.price);
    // assert.deepStrictEqual(storedProduct!.description, newProduct.description);
  });

  // Add more tests as needed
});
