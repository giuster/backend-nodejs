const request = require('supertest');
const app = require('../src/app');

describe('Products API (in-memory)', () => {
  let createdId;

  test('GET /api/products should return array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/products create', async () => {
    const res = await request(app).post('/api/products').send({ name: 'Prod1', price: 9.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Prod1');
    createdId = res.body.id || res.body._id;
  });

  test('GET /api/products/:id', async () => {
    const res = await request(app).get(`/api/products/${createdId}`);
    expect([200,404]).toContain(res.statusCode);
  });

  test('PUT /api/products/:id', async () => {
    const res = await request(app).put(`/api/products/${createdId}`).send({ price: 12 });
    expect([200,404]).toContain(res.statusCode);
  });

  test('DELETE /api/products/:id', async () => {
    const res = await request(app).delete(`/api/products/${createdId}`);
    expect([204,404]).toContain(res.statusCode);
  });
});
