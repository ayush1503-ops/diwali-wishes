import { supabase } from "../config/supabase.js";
import jwt from "jsonwebtoken";

/**
 * POST /api/auth/register
 * Register a new user via Supabase Auth + create profile
 */
export const register = async (req, res) => {
  try {
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
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/auth/login
 * Login via Supabase Auth
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`,
    });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
