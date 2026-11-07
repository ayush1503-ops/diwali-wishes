// ThemeSelector — DiwaliWish UI Kit
// Theme options: Royal Gold, Traditional Diya, Modern Neon, Rangoli, Fireworks

export function ThemeSelector({ value, onChange }) {
  const themes = [
    { id: "royal-gold", label: "Royal Gold", accent: "--dw-accent-gold" },
    { id: "traditional-diya", label: "Traditional Diya", accent: "--dw-accent-amber" },
    { id: "modern-neon", label: "Modern Neon", accent: "--dw-accent-saffron" },
    { id: "rangoli", label: "Rangoli", accent: "--dw-accent-gold" },
    { id: "fireworks", label: "Fireworks", accent: "--dw-accent-amber" },
  ];

  return (
    <div className="dw-theme-selector">
      <label className="dw-theme-selector__label" htmlFor="theme-select">
        Choose Diwali Theme
      </label>
      <div className="dw-theme-selector__options">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={value === theme.id}
            className={[
              "dw-theme-option",
              value === theme.id ? "dw-theme-option--active" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => onChange(theme.id)}
            style={{ borderColor: `var(${theme.accent})` }}
          >
            <span className="dw-theme-option__dot" />
            <span className="dw-theme-option__label">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
