/*eslint-disable */
//@ts-nocheck
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server';
import { User } from 'models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({ name: 'test', email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'User created successfully, please login to use API!'
    );

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
    expect(user.email).toBe('test@example.com');
    expect(user.password).not.toBe('password');
    const isPasswordValid = await bcrypt.compare('password', user.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should return 400 for missing email', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({ name: 'test', password: 'password' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('email is a required field');
  });

  it('should return 400 for missing password', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({ name: 'test', email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('password is a required field');
  });

  it('should return 409 for duplicate email', async () => {
    const user = new User({
      name: 'test',
      email: 'test@example.com',
      password: 'password',
    });
    await user.save();

    const response = await request(app)
      .post('/user/register')
      .send({ name: 'test', email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already exists');
  });

  it('should return 401 for wrong password', async () => {
    const user = new User({
      name: 'test',
      email: 'test@example.com',
      password: 'password',
    });
    await user.save();

    const response = await request(app)
      .post('/user/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized access');
  });

  it('should return 200 for login', async () => {
    const hashedPassword = await bcrypt.hash('password', 12);

    const user = new User({
      name: 'test',
      email: 'test@example.com',
      password: hashedPassword,
    });
    await user.save();

    const response = await request(app)
      .post('/user/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('login successfully');

    /**
     * currently commented because sending token in body is not practice
     */
    // const decoded = jwt.verify(response.body.token, 'strongsecretfortoken');
    // expect(decoded.email).toBe(user.email.toString());
  });
});
