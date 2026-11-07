import express from "express";
import { body, param, validate } from "../middleware/validate.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  getAnalytics,
  getUsers,
  toggleUserStatus,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

const validateRules = (rules) => validate(rules);

// Wish templates
router.get("/templates", getTemplates);
router.post(
  "/templates",
  validateRules([
    body("category").notEmpty(),
    body("message").notEmpty(),
    body("language").optional().notEmpty(),
    body("isActive").optional().isBoolean(),
  ]),
  createTemplate
);
router.patch(
  "/templates/:id",
  validateRules([
    param("id").notEmpty(),
    body("category").optional().notEmpty(),
    body("message").optional().notEmpty(),
    body("language").optional().notEmpty(),
    body("isActive").optional().isBoolean(),
  ]),
  updateTemplate
);

// Analytics & users
router.get("/analytics", getAnalytics);
router.get("/users", getUsers);
router.patch(
  "/users/:id/toggle",
  validateRules([param("id").notEmpty()]),
  toggleUserStatus
);

export default router;
