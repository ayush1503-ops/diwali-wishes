import { supabase } from "../config/supabase.js";
import { getZodiacSign, ZODIAC_NAMES, LUCKY_DETAILS } from "../utils/zodiac.js";
import { generateSlug } from "../utils/generateSlug.js";
import { generateAIPersonalizedWish } from "../utils/groqWish.js";

/**
 * POST /api/wishes/generate
 * Generate a personalized Diwali wish (guest or authenticated).
 * Uses Groq AI as the brain for personalized wish generation based on name and DOB.
 */
export const generateWish = async (req, res) => {
  try {
    const {
      recipientName,
      birthdate,
      gender,
      language = "en",
      theme = "royal-gold",
    } = req.body;

    if (!recipientName || !birthdate) {
      return res
        .status(400)
        .json({ message: "Name and birthdate are required" });
    }

    const birthDate = new Date(birthdate);
    const today = new Date();
    if (birthDate > today) {
      return res.status(400).json({ message: "Birthdate cannot be in the future" });
    }

    const zodiacSign = getZodiacSign(birthDate);
    const lucky = LUCKY_DETAILS[zodiacSign] || LUCKY_DETAILS.leo;
    const shareSlug = generateSlug(recipientName);

    // Try Groq AI first for personalized wish generation
    let aiResult = null;
    let useAI = false;

    try {
      aiResult = await generateAIPersonalizedWish({
        recipientName,
        birthdate: birthDate.toISOString().split("T")[0],
        zodiacSign,
        luckyColor: lucky.color,
        luckyNumber: lucky.number,
        luckyFlower: lucky.flower,
        personalityTrait: lucky.trait,
        language,
        theme,
      });
      useAI = true;
    } catch (aiError) {
      console.warn("Groq AI failed, falling back to templates:", aiError.message);
    }

    const prediction = useAI
      ? aiResult.prediction
      : `Your stars shine bright this Diwali, ${zodiacSign}. Embrace the festive light and welcome new blessings.`;

    const wishMessage = useAI
      ? aiResult.wishMessage
      : "May your life shine as brightly as a thousand diyas. Wishing you happiness, prosperity, and beautiful memories.";

    const wishData = {
      user_id: req.user ? req.user.id : null,
      recipient_name: recipientName,
      birthdate: birthDate.toISOString().split("T")[0],
      zodiac_sign: zodiacSign,
      theme,
      prediction,
      wish_message: wishMessage,
      lucky_color: lucky.color,
      lucky_number: lucky.number,
      lucky_flower: lucky.flower,
      personality_trait: lucky.trait,
      share_slug: shareSlug,
      is_public: true,
    };

    const { data: wish, error } = await supabase
      .from("wishes")
      .insert(wishData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      wishId: wish.id,
      recipientName: wish.recipient_name,
      zodiacSign: ZODIAC_NAMES[zodiacSign] || zodiacSign,
      theme: wish.theme,
      prediction: wish.prediction,
      wishMessage: wish.wish_message,
      luckyColor: wish.lucky_color,
      luckyNumber: wish.lucky_number,
      luckyFlower: wish.lucky_flower,
      personalityTrait: wish.personality_trait,
      shareSlug: wish.share_slug,
      generatedBy: useAI ? "groq-ai" : "template",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/wishes/public/:slug
 * View a public wish by share slug.
 */
export const getPublicWish = async (req, res) => {
  try {
    const { data: wish, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("share_slug", req.params.slug)
      .eq("is_public", true)
      .single();

    if (error || !wish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    // Increment views
    await supabase
      .from("wishes")
      .update({ views: wish.views + 1 })
      .eq("id", wish.id);

    // Log analytics
    await supabase.from("analytics").insert([
      {
        wish_id: wish.id,
        action: "view",
        ip_address: req.ip || req.connection.remoteAddress,
      },
    ]);

    res.json({
      id: wish.id,
      userId: wish.user_id,
      recipientName: wish.recipient_name,
      birthdate: wish.birthdate,
      zodiacSign: ZODIAC_NAMES[wish.zodiac_sign] || wish.zodiac_sign,
      theme: wish.theme,
      prediction: wish.prediction,
      wishMessage: wish.wish_message,
      luckyColor: wish.lucky_color,
      luckyNumber: wish.lucky_number,
      luckyFlower: wish.lucky_flower,
      personalityTrait: wish.personality_trait,
      shareSlug: wish.share_slug,
      isPublic: wish.is_public,
      views: wish.views + 1,
      shares: wish.shares,
      downloads: wish.downloads,
      createdAt: wish.created_at,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/wishes/my
 * Get logged-in user's wishes.
 */
export const getMyWishes = async (req, res) => {
  try {
    const { data: wishes, error } = await supabase
      .from("wishes")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(
      wishes.map((w) => ({
        id: w.id,
        userId: w.user_id,
        recipientName: w.recipient_name,
        birthdate: w.birthdate,
        zodiacSign: ZODIAC_NAMES[w.zodiac_sign] || w.zodiac_sign,
        theme: w.theme,
        prediction: w.prediction,
        wishMessage: w.wish_message,
        luckyColor: w.lucky_color,
        luckyNumber: w.lucky_number,
        luckyFlower: w.lucky_flower,
        personalityTrait: w.personality_trait,
        shareSlug: w.share_slug,
        isPublic: w.is_public,
        views: w.views,
        shares: w.shares,
        downloads: w.downloads,
        createdAt: w.created_at,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/wishes/:id
 * Update a saved wish (owner only).
 */
export const updateWish = async (req, res) => {
  try {
    const { data: wish, error: fetchError } = await supabase
      .from("wishes")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !wish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    if (wish.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { theme, isPublic, recipientName, birthdate } = req.body;
    const updates = {};
    if (theme) updates.theme = theme;
    if (isPublic !== undefined) updates.is_public = isPublic;
    if (recipientName) updates.recipient_name = recipientName;
    if (birthdate) updates.birthdate = birthdate;

    const { data: updated, error } = await supabase
      .from("wishes")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      id: updated.id,
      theme: updated.theme,
      isPublic: updated.is_public,
      recipientName: updated.recipient_name,
      birthdate: updated.birthdate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/wishes/:id
 * Delete a saved wish (owner only).
 */
export const deleteWish = async (req, res) => {
  try {
    const { data: wish, error: fetchError } = await supabase
      .from("wishes")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !wish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    if (wish.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { error } = await supabase.from("wishes").delete().eq("id", req.params.id);

    if (error) throw error;

    res.json({ message: "Wish removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/wishes/:id/share — increment share count
 */
export const shareWish = async (req, res) => {
  try {
    const { data: wish, error: fetchError } = await supabase
      .from("wishes")
      .select("shares")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !wish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    const { error } = await supabase
      .from("wishes")
      .update({ shares: wish.shares + 1 })
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ shares: wish.shares + 1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/wishes/:id/download — increment download count
 */
export const downloadWish = async (req, res) => {
  try {
    const { data: wish, error: fetchError } = await supabase
      .from("wishes")
      .select("downloads")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !wish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    const { error } = await supabase
      .from("wishes")
      .update({ downloads: wish.downloads + 1 })
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ downloads: wish.downloads + 1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
