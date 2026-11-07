import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

/**
 * Authentication middleware — verifies JWT and attaches req.user from Supabase profiles.
 */
export const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch profile from Supabase
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", decoded.id)
        .single();

      if (error || !profile || !profile.is_active) {
        return res.status(401).json({ message: "User not found or inactive" });
      }

      req.user = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
      };
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

/**
 * Admin role middleware — must be used after authMiddleware.
 */
export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Not authorized as an admin" });
};
