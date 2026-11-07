// Utility helpers (date formatting, validation, animation helpers)

export function formatDate(date = new Date()) {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
