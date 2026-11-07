// DiyaAnimation — DiwaliWish UI Kit
// CSS keyframe flicker with realistic glowing light falloff

export function DiyaAnimation({ size = "md", className = "" }) {
  const sizes = {
    sm: { w: "48px", h: "60px", flameW: "16px", flameH: "24px" },
    md: { w: "64px", h: "80px", flameW: "24px", flameH: "32px" },
    lg: { w: "96px", h: "120px", flameW: "36px", flameH: "48px" },
  };
  const s = sizes[size];

  return (
    <div
      className={["dw-diya", `dw-diya--${size}`, className].filter(Boolean).join(" ")}
      role="img"
      aria-label="Diya (oil lamp) — festive light element"
    >
      {/* Lamp body */}
      <div className="dw-diya__body" style={{ width: s.w, height: s.h }}>
        <div className="dw-diya__reservoir" />
        <div className="dw-diya__wick" />
      </div>
      {/* Flame with flicker animation */}
      <div className="dw-diya__flame" style={{ width: s.flameW, height: s.flameH }} />
      {/* Glow halo */}
      <div className="dw-diya__glow" />
    </div>
  );
}

export default DiyaAnimation;
