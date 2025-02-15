"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*eslint-disable */
//@ts-nocheck
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
let mongoServer;
beforeAll(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose_1.default.disconnect();
    await mongoose_1.default.connect(uri);
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
describe('Authentication', () => {
    beforeEach(async () => {
        await models_1.User.deleteMany({});
    });
    it('should register a new user successfully', async () => {
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/user/register')
            .send({ name: 'test', email: 'test@example.com', password: 'password' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created successfully, please login to use API!');
        const user = await models_1.User.findOne({ email: 'test@example.com' });
        expect(user).not.toBeNull();
        expect(user.email).toBe('test@example.com');
        expect(user.password).not.toBe('password');
        const isPasswordValid = await bcrypt_1.default.compare('password', user.password);
        expect(isPasswordValid).toBe(true);
    });
    it('should return 400 for missing email', async () => {
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/user/register')
            .send({ name: 'test', password: 'password' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('email is a required field');
    });
    it('should return 400 for missing password', async () => {
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/user/register')
            .send({ name: 'test', email: 'test@example.com' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('password is a required field');
    });
    it('should return 409 for duplicate email', async () => {
        const user = new models_1.User({
            name: 'test',
            email: 'test@example.com',
            password: 'password',
        });
        await user.save();
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/user/register')
            .send({ name: 'test', email: 'test@example.com', password: 'password' });
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Email already exists');
    });
    it('should return 401 for wrong password', async () => {
        const user = new models_1.User({
            name: 'test',
            email: 'test@example.com',
            password: 'password',
        });
        await user.save();
        const response = await (0, supertest_1.default)(server_1.default)
            .post('/user/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized access');
    });
    it('should return 200 for login', async () => {
        const hashedPassword = await bcrypt_1.default.hash('password', 12);
        const user = new models_1.User({
            name: 'test',
            email: 'test@example.com',
            password: hashedPassword,
        });
        await user.save();
        const response = await (0, supertest_1.default)(server_1.default)
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
