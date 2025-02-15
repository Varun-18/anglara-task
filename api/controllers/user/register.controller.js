"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regsisterUser = void 0;
const helpers_1 = require("./helpers");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const constant_1 = require("../../constant");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const regsisterUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await (0, helpers_1.checkExistingUser)(email, false);
        if (existingUser) {
            res
                .status(constant_1.STATUS_CODES.CONFLICT)
                .json({ message: 'Email already exists' });
            return;
        }
        const hashedPassword = await (0, utils_1.generateHash)(password);
        const newUser = new models_1.User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(constant_1.STATUS_CODES.CREATED).json({
            message: 'User created successfully, please login to use API!',
        });
    }
    catch (error) {
        res.status(constant_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: error || constant_1.RES_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
exports.regsisterUser = regsisterUser;
