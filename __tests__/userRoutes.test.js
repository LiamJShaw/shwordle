const supertest = require('supertest');
const app = require('../app');

describe('User Routes', () => {

  describe('Sign up Route', () => {
    it('should sign up a new user with valid input', async () => {
      const response = await supertest(app)
        .post('/user/signup')
        .send({
          username: 'testuser',
          password: 'password1234',
          confirmpassword: 'password1234'
        });

      expect(response.statusCode).toBe(302); // 302 is a redirect on success
    });

    it('should not sign up a new user with invalid input', async () => {
      const response = await supertest(app)
        .post('/user/signup')
        .send({
          username: 'te',
          password: 'pass',
          confirmpassword: 'password'
        });

      expect(response.statusCode).toBe(302); // Redirects with errors using Flash
    });
  });

  describe('Login Route', () => {
    it('should login with valid input', async () => {
      const response = await supertest(app)
        .post('/user/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.statusCode).toBe(302); // 302 is redirect on success
    });

    it('should not login with invalid input', async () => {
      const response = await supertest(app)
        .post('/user/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Update Score Route', () => {
    it('should update score with valid input', async () => {
      const response = await supertest(app)
        .post('/user/update-score')
        .send({
          username: 'testuser',
          score: 10
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.scores).toContain(10);
    });

    it('should not update score with invalid input', async () => {
      const response = await supertest(app)
        .post('/user/update-score')
        .send({
          username: 'nonexistentuser',
          score: 10
        });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('Logout Route', () => {
    it('should logout successfully', async () => {
      const response = await supertest(app)
        .post('/user/logout');

      expect(response.statusCode).toBe(302); // 302 is redirect on success
    });
  });
});
