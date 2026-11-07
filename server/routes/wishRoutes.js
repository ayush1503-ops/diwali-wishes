import express from "express";
import { body, param, validate } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  generateWish,
  getPublicWish,
  getMyWishes,
  updateWish,
  deleteWish,
  shareWish,
  downloadWish,
} from "../controllers/wishController.js";

const router = express.Router();

// Public wish view + tracking (no auth required)
router.get("/public/:slug", getPublicWish);

// Generate a wish (guest or authenticated; saved to account if logged in)
router.post(
  "/generate",
  validate([
    body("recipientName").notEmpty().trim().escape(),
    body("birthdate").notEmpty().isDate().isNotFuture(),
    body("theme").optional().notEmpty(),
    body("language").optional().notEmpty(),
  ]),
  generateWish
);

// Authenticated wish management
router.get("/me", authMiddleware, getMyWishes);
router.patch(
  "/:id",
  authMiddleware,
  validate([
    param("id").notEmpty(),
    body("theme").optional().notEmpty(),
    body("isPublic").optional().isBoolean(),
    body("recipientName").optional().notEmpty().trim().escape(),
    body("birthdate").optional().isDate().isNotFuture(),
  ]),
  updateWish
);
router.delete(
  "/:id",
  authMiddleware,
  validate([param("id").notEmpty()]),
  deleteWish
);
router.post(
  "/:id/share",
  authMiddleware,
  validate([param("id").notEmpty()]),
  shareWish
);
router.post(
  "/:id/download",
  authMiddleware,
  validate([param("id").notEmpty()]),
  downloadWish
);

export default router;
