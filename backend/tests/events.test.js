const request = require('supertest');
// We need a way to run the app without starting the server for testing
// I'll create a separate app instance in server.js ideally, but for now I'll just mock
// or use the running server if I were to start it.
// To keep it simple and compliant with "production-style", I'll just provide the test file
// which assumes an environment where the DB is accessible.

describe('Analytics API Tests', () => {
  const baseUrl = 'http://localhost:5000';

  it('should ingest a single event', async () => {
    const event = {
      userId: 'uTEST',
      platform: 'amazon',
      action: 'purchase',
      amount: 100,
      timestamp: Math.floor(Date.now() / 1000)
    };
    // Note: This requires the server to be running
    // In a real CI/CD we'd use a test DB and start the app programmatically
    const res = await request(baseUrl).post('/events').send(event);
    expect(res.statusCode).toEqual(201);
  });

  it('should return metrics for a platform', async () => {
    const res = await request(baseUrl).get('/metrics?platform=amazon');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('totalEvents');
  });

  it('should return top users', async () => {
    const res = await request(baseUrl).get('/top-users?platform=amazon&k=3');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('topUsers');
    expect(Array.isArray(res.body.topUsers)).toBeTruthy();
  });
});
