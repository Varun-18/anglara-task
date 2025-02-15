"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    parent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'category',
        required: false,
        default: null,
        index: true,
    },
    children: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'category',
            required: false,
            default: [],
        },
    ],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
});
exports.CategoryModel = mongoose_1.default.model('category', categorySchema);
