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
let authCookie;
beforeAll(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose_1.default.disconnect();
    await mongoose_1.default.connect(uri);
    const hashedPassword = await bcrypt_1.default.hash('password', 12);
    const user = new models_1.User({
        name: 'test',
        email: 'test@example.com',
        password: hashedPassword,
    });
    await user.save();
    const loginResponse = await (0, supertest_1.default)(server_1.default)
        .post('/user/login')
        .send({ email: 'test@example.com', password: 'password' });
    authCookie = loginResponse.headers['set-cookie'];
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
describe('Category', () => {
    beforeEach(async () => {
        await models_1.CategoryModel.deleteMany({});
    });
    it('should create a category with default status as active', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/category')
            .set('Cookie', authCookie)
            .send({ name: 'Electronics' })
            .expect(201);
        expect(res.body.newCategory.status).toBe('active');
    });
    it('should update the name of category', async () => {
        const res1 = await (0, supertest_1.default)(server_1.default)
            .post('/category')
            .set('Cookie', authCookie)
            .send({ name: 'Electronics' })
            .expect(201);
        expect(res1.body.newCategory.status).toBe('active');
        const res = await (0, supertest_1.default)(server_1.default)
            .put('/category')
            .set('Cookie', authCookie)
            .send({ id: res1.body.newCategory._id, name: 'Electronics updated' })
            .expect(200);
        expect(res.body.message).toBe('Category name updated successfully!');
    });
    it('should update the status of category form active to inactive', async () => {
        const res1 = await (0, supertest_1.default)(server_1.default)
            .post('/category')
            .set('Cookie', authCookie)
            .send({ name: 'Electronics' })
            .expect(201);
        expect(res1.body.newCategory.status).toBe('active');
        const response = await (0, supertest_1.default)(server_1.default)
            .put('/category')
            .set('Cookie', authCookie)
            .send({ id: res1.body.newCategory._id, status: 'inactive' })
            .expect(200);
        expect(response.body.message).toBe('Status updated successfully!');
    });
    it('should delete category', async () => {
        const res1 = await (0, supertest_1.default)(server_1.default)
            .post('/category')
            .set('Cookie', authCookie)
            .send({ name: 'Electronics' })
            .expect(201);
        expect(res1.body.newCategory.status).toBe('active');
        const res = await (0, supertest_1.default)(server_1.default)
            .delete(`/category/${res1.body.newCategory._id}`)
            .set('Cookie', authCookie)
            .expect(200);
        expect(res.body.message).toBe('Category deleted successfully!');
    });
    it('should create a category and get the response for listing all categories', async () => {
        const res1 = await (0, supertest_1.default)(server_1.default)
            .post('/category')
            .set('Cookie', authCookie)
            .send({ name: 'Electronics' })
            .expect(201);
        expect(res1.body.newCategory.status).toBe('active');
        const res = await (0, supertest_1.default)(server_1.default)
            .get('/category')
            .set('Cookie', authCookie)
            .expect(200);
        expect(res.body.categories[0].name).toBe('Electronics');
    });
});
