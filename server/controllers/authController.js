import { supabase, isSupabaseConfigured } from "../config/supabase.js";
import jwt from "jsonwebtoken";

/**
 * POST /api/auth/register
 * Register a new user via Supabase Auth + create profile
 */
export const register = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(500).json({
        message:
          "Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    // Create profile in profiles table
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          name,
          email,
          role: "user",
          is_active: true,
        },
      ]);

      if (profileError) {
        return res.status(400).json({ message: profileError.message });
      }
    }

    // Generate JWT for our app
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET not configured" });
    }

    const token = jwt.sign({ id: authData.user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.status(201).json({
      id: authData.user.id,
      name: authData.user.user_metadata.name || name,
      email: authData.user.email,
      role: "user",
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

/**
 * POST /api/auth/login
 * Login via Supabase Auth
 */
export const login = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(500).json({
        message:
          "Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please add email and password" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Fetch profile to get role
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET not configured" });
    }

    const token = jwt.sign({ id: data.user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.json({
      id: data.user.id,
      name: data.user.user_metadata.name || profile?.name,
      email: data.user.email,
      role: profile?.role || "user",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(500).json({
        message:
          "Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.",
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password`,
    });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: error.message || "Forgot password failed" });
  }
};
