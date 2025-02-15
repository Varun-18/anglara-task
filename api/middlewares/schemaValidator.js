"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaValidator = void 0;
const constant_1 = require("../constant");
const yup_1 = require("yup");
const schemaValidator = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        return next();
    }
    catch (error) {
        if (error instanceof yup_1.ValidationError) {
            res.status(constant_1.STATUS_CODES.BAD_REQUEST).json({ message: error.message });
            return;
        }
        res
            .status(constant_1.STATUS_CODES.BAD_REQUEST)
            .json({ message: constant_1.RES_MESSAGES.BAD_REQUEST });
    }
};
exports.schemaValidator = schemaValidator;
