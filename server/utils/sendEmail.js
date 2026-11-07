import fs from "fs";
import path from "path";
import crypto from "crypto";

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "email.log");

/**
 * diwaliwish — email utility
 *
 * Development/stub implementation: writes every outgoing email to console and to
 * logs/email.log so reset links can be inspected without a real SMTP server.
 *
 * To use real email in production, replace sendEmail() with a nodemailer/
 * SMTP transporter and keep the same ({ to, subject, text, html }) signature.
 */

export async function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

export const sendEmail = async ({ to, subject, text, html }) => {
  await ensureLogDir();
  const timestamp = new Date().toISOString();
  const entry = `\n--- ${timestamp} ---\nTo: ${to}\nSubject: ${subject}\n\n${text || ""}\n${html ? "\n[HTML body present]\n" : ""}`;

  fs.appendFileSync(LOG_FILE, entry);

  console.log("==============================================");
  console.log("  [MOCK EMAIL]");
  console.log("  To:", to);
  console.log("  Subject:", subject);
  console.log("  Body:\n", text || "");
  console.log("  Logged to:", LOG_FILE);
  console.log("==============================================");

  return {
    success: true,
    mock: true,
    messageId: `mock-${crypto.randomBytes(4).toString("hex")}`,
    loggedTo: LOG_FILE,
  };
};
