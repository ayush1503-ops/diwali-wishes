import { supabase } from "../config/supabase.js";

/**
 * GET /api/admin/templates — View all wish templates.
 */
export const getTemplates = async (req, res) => {
  try {
    const { data: templates, error } = await supabase
      .from("wish_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/admin/templates — Create a wish template.
 */
export const createTemplate = async (req, res) => {
  try {
    const { category, message, language = "en", isActive } = req.body;

    const { data: template, error } = await supabase
      .from("wish_templates")
      .insert([
        {
          category,
          message,
          language,
          is_active: isActive !== false,
          created_by: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/admin/templates/:id — Update template (enable/disable/edit).
 */
export const updateTemplate = async (req, res) => {
  try {
    const { message, language, isActive } = req.body;

    const { data: template, error } = await supabase
      .from("wish_templates")
      .update({
        ...(message !== undefined && { message }),
        ...(language !== undefined && { language }),
        ...(isActive !== undefined && { is_active: isActive }),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/admin/analytics — View app analytics.
 */
export const getAnalytics = async (req, res) => {
  try {
    const { count: totalWishes, error: wError } = await supabase
      .from("wishes")
      .select("*", { count: "exact", head: true });

    const { count: totalUsers, error: uError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user");

    const { data: sharesData, error: sError } = await supabase
      .from("wishes")
      .select("shares");

    const { data: downloadsData, error: dError } = await supabase
      .from("wishes")
      .select("downloads");

    const { data: topThemes, error: tError } = await supabase
      .from("wishes")
      .select("theme")
      .not("theme", "is", null);

    if (wError || uError || sError || dError || tError) {
      throw new Error("Failed to fetch analytics");
    }

    const totalShares = sharesData?.reduce((sum, w) => sum + (w.shares || 0), 0) || 0;
    const totalDownloads = downloadsData?.reduce((sum, w) => sum + (w.downloads || 0), 0) || 0;

    const themeCounts = {};
    topThemes?.forEach((w) => {
      themeCounts[w.theme] = (themeCounts[w.theme] || 0) + 1;
    });
    const sortedThemes = Object.entries(themeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([theme, count]) => ({ _id: theme, count }));

    res.json({
      totalWishes: totalWishes || 0,
      totalUsers: totalUsers || 0,
      totalShares,
      totalDownloads,
      topThemes: sortedThemes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/admin/users — View all users.
 */
export const getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/admin/users/:id/block — Block or deactivate a user.
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { data: user, error: fetchError } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { data: updated, error } = await supabase
      .from("profiles")
      .update({ is_active: !user.is_active })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ isActive: updated.is_active });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
