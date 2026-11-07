import crypto from "crypto";

/**
 * Generate a unique, URL-friendly share slug for a wish.
 */
export function generateSlug(recipientName) {
  const base = recipientName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const random = crypto.randomBytes(3).toString("hex");
  return `${base}-${random}`;
}
