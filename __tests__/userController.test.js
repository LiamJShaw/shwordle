const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const userController = require('../controllers/userController');

jest.mock('bcryptjs');
jest.mock('../models/user');
jest.mock('express-validator');

let app;

beforeEach(() => {
  app = express();
  app.use(express.json());
});

describe('User Controller', () => {
  describe('Create User', () => {
    it('should create a user when valid input is provided', async () => {
      const req = {
        body: { username: 'testuser', password: 'testpassword' },
        login: jest.fn((user, cb) => cb(null)),
        flash: jest.fn(),
      };
      const res = { redirect: jest.fn() };
      const next = jest.fn();

      validationResult.mockReturnValue({ isEmpty: () => true });
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(true) }));

      await userController.createUser(req, res, next);

      expect(User).toHaveBeenCalledWith({ username: 'testuser', password: 'hashedpassword' });
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('Get User Stats', () => {
    it('should return user stats when a valid user is provided', async () => {
      const req = { user: { username: 'testuser' } };
      const res = { json: jest.fn(), status: jest.fn(() => res) };
      const next = jest.fn();

      const mockScores = [1, 2, 3];
      const mockUser = { username: 'testuser', scores: mockScores };
      User.findOne.mockResolvedValue(mockUser);

      await userController.getUserStats(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(res.json).toHaveBeenCalledWith({
        counts: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 0, 6: 0 },
        totalGames: 3,
      });
    });

    it('should return 404 if user is not found', async () => {
      const req = { user: { username: 'nonexistentuser' } };
      const res = { json: jest.fn(), status: jest.fn(() => res) };
      const next = jest.fn();

      User.findOne.mockResolvedValue(null);

      await userController.getUserStats(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
});