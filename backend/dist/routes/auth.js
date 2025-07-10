"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', authController_1.AuthController.register);
router.post('/login', authController_1.AuthController.login);
router.get('/me', auth_1.authMiddleware, authController_1.AuthController.getCurrentUser);
router.put('/profile', auth_1.authMiddleware, authController_1.AuthController.updateProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map