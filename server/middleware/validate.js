/**
 * diwaliwish — request validation middleware
 *
 * Declarative, express-validator-compatible validation API (body / param / query /
 * check + validationResult). It is a self-contained implementation so the backend
 * runs without the express-validator package, but route definitions use the same
 * chainable style and can be swapped to the real express-validator later with no
 * route changes.
 */

const EMAIL_RE =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$/i;

const trim = (v) => (v == null ? v : String(v).trim());
const escapeHtml = (v) =>
  v == null
    ? v
    : String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const checks = {
  notEmpty: (v) => v !== undefined && v !== null && String(v).trim() !== "",
  isEmail: (v) => EMAIL_RE.test(String(v)),
  isLength: (v, { min, max } = {}) => {
    const len = String(v).length;
    return (min == null || len >= min) && (max == null || len <= max);
  },
  isDate: (v) => {
    const d = new Date(v);
    return !isNaN(d.getTime()) && String(v).trim() !== "";
  },
  isNotFuture: (v) => {
    const d = new Date(v);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return d <= today;
  },
  isIn: (v, values) => (Array.isArray(values) ? values.includes(v) : false),
  isStrongPassword: (v) => {
    const s = String(v);
    return (
      s.length >= 8 &&
      /[A-Z]/.test(s) &&
      /[a-z]/.test(s) &&
      /[0-9]/.test(s) &&
      /[^A-Za-z0-9]/.test(s)
    );
  },
  isBoolean: (v) => typeof v === "boolean",
};

class ValidationRule {
  constructor(field, location) {
    this.field = field;
    this.location = location; // 'body' | 'params' | 'query'
    this.stack = []; // { fn, msg }
    this.transforms = [];
  }
  notEmpty(msg) {
    this.stack.push({ fn: checks.notEmpty, msg: msg || `${this.field} is required` });
    return this;
  }
  isEmail(msg) {
    this.stack.push({ fn: checks.isEmail, msg: msg || "Please provide a valid email" });
    return this;
  }
  isLength(options, msg) {
    this.stack.push({
      fn: (v) => checks.isLength(v, options),
      msg: msg || `Invalid length for ${this.field}`,
    });
    return this;
  }
  isDate(msg) {
    this.stack.push({ fn: checks.isDate, msg: msg || `${this.field} must be a valid date` });
    return this;
  }
  isNotFuture(msg) {
    this.stack.push({ fn: checks.isNotFuture, msg: msg || `${this.field} cannot be in the future` });
    return this;
  }
  isIn(values, msg) {
    this.stack.push({
      fn: (v) => checks.isIn(v, values),
      msg: msg || `${this.field} must be one of: ${Array.isArray(values) ? values.join(", ") : values}`,
    });
    return this;
  }
  isStrongPassword(msg) {
    this.stack.push({
      fn: checks.isStrongPassword,
      msg: msg || "Password must be at least 8 characters with uppercase, lowercase, a number and a symbol",
    });
    return this;
  }
  isBoolean(msg) {
    this.stack.push({ fn: checks.isBoolean, msg: msg || `${this.field} must be a boolean` });
    return this;
  }
  custom(fn, msg) {
    this.stack.push({ fn, msg: msg || `Invalid ${this.field}` });
    return this;
  }
  optional() {
    this.optional = true;
    return this;
  }
  withMessage(msg) {
    const last = this.stack[this.stack.length - 1];
    if (last) last.msg = msg;
    return this;
  }
  trim() {
    this.transforms.push("trim");
    return this;
  }
  normalizeEmail() {
    this.transforms.push("normalizeEmail");
    return this;
  }
  escape() {
    this.transforms.push("escape");
    return this;
  }
}

function body(field) {
  return new ValidationRule(field, "body");
}
function param(field) {
  return new ValidationRule(field, "params");
}
function query(field) {
  return new ValidationRule(field, "query");
}
function check(field) {
  return new ValidationRule(field, "body");
}

function runTransforms(value, transforms) {
  let v = value;
  for (const t of transforms) {
    if (t === "trim") v = trim(v);
    else if (t === "normalizeEmail") v = v == null ? v : String(v).toLowerCase();
    else if (t === "escape") v = escapeHtml(v);
  }
  return v;
}

/**
 * Collects validation errors without attaching to req, so callers can decide how
 * to respond (useful for custom handlers).
 */
export const validationResult = (req) => req._validationErrors || [];

/**
 * Middleware factory. Runs each rule chain; on first failure per field responds
 * 400 with { success: false, message, errors: [...] }.
 */
export const validate = (rules) => (req, res, next) => {
  const errors = [];
  for (const rule of rules) {
    const source = req[rule.location];
    if (!source) continue;
    const value = source[rule.field];
    if (rule.optional && value === undefined) continue;
    let transformed = runTransforms(value, rule.transforms);
    req[rule.location][rule.field] = transformed;
    for (const { fn, msg } of rule.stack) {
      try {
        if (!fn(value)) {
          errors.push({ field: rule.field, location: rule.location, message: msg });
          break;
        }
      } catch (err) {
        errors.push({ field: rule.field, location: rule.location, message: msg || err.message });
        break;
      }
    }
  }
  if (errors.length) {
    req._validationErrors = errors;
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  next();
};

export { body, param, query, check };
