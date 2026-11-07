import { motion } from "framer-motion";

export function DiyaAnimation({ className = "", size = "md" }) {
  const sizes = {
    sm: { w: "w-12", h: "h-16", flameW: "w-4", flameH: "h-6" },
    md: { w: "w-16", h: "h-20", flameW: "w-6", flameH: "h-8" },
    lg: { w: "w-24", h: "h-30", flameW: "w-9", flameH: "h-12" },
  };
  const s = sizes[size];

  return (
    <div
      className={`relative ${s.w} ${s.h} ${className}`}
      role="img"
      aria-label="Diya (oil lamp) — festive light element"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[45%] bg-[#3E0A14] border-2 border-dw-border-gold rounded-br-[60%] rounded-bl-[60%] rounded-tr-[40%] rounded-tl-[40%] shadow-[inset_0_2px_4px_rgba(212,175,55,0.2)]"></div>
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[12%] h-[22%] bg-[#5A4A3A] rounded"></div>
      <div
        className={`absolute top-[-40%] left-1/2 -translate-x-1/2 ${s.flameW} ${s.flameH} bg-[#FF9F00] rounded-full blur-sm animate-flicker`}
      />
      <div
        className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-16 h-16 bg-dw-accent-gold/40 rounded-full blur-md"
        style={{ animation: "dw-glow-pulse 4s ease-in-out infinite" }}
      />
    </div>
  );
}

export default DiyaAnimation;
