/*eslint-disable */
//@ts-nocheck
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server';
import { CategoryModel, User } from 'models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;

let authCookie;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);

  const hashedPassword = await bcrypt.hash('password', 12);

  const user = new User({
    name: 'test',
    email: 'test@example.com',
    password: hashedPassword,
  });
  await user.save();

  const loginResponse = await request(app)
    .post('/user/login')
    .send({ email: 'test@example.com', password: 'password' });

  authCookie = loginResponse.headers['set-cookie'];
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Category', () => {
  beforeEach(async () => {
    await CategoryModel.deleteMany({});
  });

  it('should create a category with default status as active', async () => {
    const res = await request(app)
      .post('/category')
      .set('Cookie', authCookie)
      .send({ name: 'Electronics' })
      .expect(201);

    expect(res.body.newCategory.status).toBe('active');
  });

  it('should update the name of category', async () => {
    const res1 = await request(app)
      .post('/category')
      .set('Cookie', authCookie)
      .send({ name: 'Electronics' })
      .expect(201);

    expect(res1.body.newCategory.status).toBe('active');

    const res = await request(app)
      .put('/category')
      .set('Cookie', authCookie)
      .send({ id: res1.body.newCategory._id, name: 'Electronics updated' })
      .expect(200);

    expect(res.body.message).toBe('Category name updated successfully!');
  });

  it('should update the status of category form active to inactive', async () => {
    const res1 = await request(app)
      .post('/category')
      .set('Cookie', authCookie)
      .send({ name: 'Electronics' })
      .expect(201);

    expect(res1.body.newCategory.status).toBe('active');

    const response = await request(app)
      .put('/category')
      .set('Cookie', authCookie)
      .send({ id: res1.body.newCategory._id, status: 'inactive' })
      .expect(200);

    expect(response.body.message).toBe('Status updated successfully!');
  });

  it('should delete category', async () => {
    const res1 = await request(app)
      .post('/category')
      .set('Cookie', authCookie)
      .send({ name: 'Electronics' })
      .expect(201);

    expect(res1.body.newCategory.status).toBe('active');

    const res = await request(app)
      .delete(`/category/${res1.body.newCategory._id}`)
      .set('Cookie', authCookie)
      .expect(200);

    expect(res.body.message).toBe('Category deleted successfully!');
  });

  it('should create a category and get the response for listing all categories', async () => {
    const res1 = await request(app)
      .post('/category')
      .set('Cookie', authCookie)
      .send({ name: 'Electronics' })
      .expect(201);

    expect(res1.body.newCategory.status).toBe('active');

    const res = await request(app)
      .get('/category')
      .set('Cookie', authCookie)
      .expect(200);

    expect(res.body.categories[0].name).toBe('Electronics');
  });
});
