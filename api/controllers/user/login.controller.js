"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("../../utils");
const helpers_1 = require("./helpers");
const constant_1 = require("../../constant");
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, helpers_1.checkExistingUser)(email, true);
        if (user === null) {
            res
                .status(constant_1.STATUS_CODES.BAD_REQUEST)
                .json({ message: constant_1.RES_MESSAGES.BAD_REQUEST });
            return;
        }
        const isMatch = await (0, utils_1.compareHash)(password, user.password);
        if (!isMatch) {
            res
                .status(constant_1.STATUS_CODES.UNAUTHORIZED)
                .json({ message: constant_1.RES_MESSAGES.UNAUTHORIZED });
            return;
        }
        const token = (0, jsonwebtoken_1.sign)({ email: user.email }, (process.env.JWT_SECRET || 'jwtsecret'), { expiresIn: process.env.JWT_EXPIRY || '1h' });
        res
            .status(constant_1.STATUS_CODES.OK)
            .cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite: 'none',
        })
            .json({ message: 'login successfully' });
    }
    catch (error) {
        res.status(constant_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: error || constant_1.RES_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
exports.loginUser = loginUser;
