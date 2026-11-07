import { motion } from "framer-motion";

const themes = [
  { id: "royal-gold", label: "Royal Gold", accent: "dw-bg-accent-gold" },
  { id: "traditional-diya", label: "Traditional Diya", accent: "dw-text-[#8B0000]" },
  { id: "modern-neon", label: "Modern Neon", accent: "dw-text-[#FF9F00]" },
  { id: "rangoli", label: "Rangoli", accent: "dw-text-[#D4AF37]" },
  { id: "fireworks", label: "Fireworks", accent: "dw-text-[#FF9F00]" },
];

export function ThemeSelector({ value, onChange }) {
  return (
    <div className="dw-theme-selector">
      <label className="dw-label">Choose Diwali Theme</label>
      <div className="flex gap-2 flex-wrap">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={value === theme.id}
            onClick={() => onChange(theme.id)}
            className={`dw-btn dw-btn--ghost dw-text-xs px-3 py-1.5 ${
              value === theme.id
                ? "border-dw-border-gold bg-[#d4af37]dw-text-ink"
                : "border-dw-border-default dw-text-muted hover:border-dw-border-gold hover:bg-[#d4af37]/10"
            }`}
          >
            {theme.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
