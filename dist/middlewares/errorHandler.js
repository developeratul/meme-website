"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
function notFoundHandler(req, res, next) {
    next({ status: 404, message: "Your requested route was not found" });
}
exports.notFoundHandler = notFoundHandler;
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next("There was an unexpected error");
    }
    else {
        res.status(err.status || 500).json({ status: err.status || 500, message: err.message || err });
    }
}
exports.errorHandler = errorHandler;
