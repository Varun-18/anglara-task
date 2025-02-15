"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetails = void 0;
const helpers_1 = require("./helpers");
const constant_1 = require("../../constant");
const getUserDetails = async (req, res) => {
    try {
        const user = req.user;
        const currentUser = await (0, helpers_1.checkExistingUser)(user.email, false);
        if (!currentUser) {
            res
                .status(constant_1.STATUS_CODES.UNAUTHORIZED)
                .json({ message: constant_1.RES_MESSAGES.UNAUTHORIZED });
            return;
        }
        res.status(constant_1.STATUS_CODES.OK).json({ user: currentUser });
    }
    catch (error) {
        res
            .status(constant_1.STATUS_CODES.BAD_REQUEST)
            .json({ message: error || constant_1.RES_MESSAGES.BAD_REQUEST });
    }
};
exports.getUserDetails = getUserDetails;
