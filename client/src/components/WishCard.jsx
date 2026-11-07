import { motion } from "framer-motion";

export function WishCard({
  recipientName = "Aarav",
  zodiacSign = "Leo",
  luckyColor = "Gold",
  luckyNumber = 7,
  luckyFlower = "Sunflower",
  personalityTrait = "Confident Leader",
  prediction = "Your confidence will open exciting doors for you this year.",
  wishMessage = "May your life shine as brightly as a thousand diyas. Wishing you happiness, prosperity, and beautiful memories.",
  theme = "royal-gold",
  isFlipped = false,
  onFlip,
  onDownload,
  className = "",
}) {
  const themeStyles = {
    "royal-gold": { bg: "dw-bg-midnight", accent: "dw-bg-accent-gold" },
    "traditional-diya": { bg: "dw-bg-maroon", accent: "dw-text-[#8B0000]" },
    "modern-neon": { bg: "dw-bg-midnight", accent: "dw-text-[#FF9F00]" },
    rangoli: { bg: "dw-bg-midnight", accent: "dw-text-[#D4AF37]" },
    fireworks: { bg: "dw-bg-midnight", accent: "dw-text-[#FF9F00]" },
  };
  const t = themeStyles[theme] || themeStyles["royal-gold"];

  return (
    <motion.div
      className={`relative w-full max-w-md aspect-[3/4] dw-surface-card border dw-border-default rounded-[var(--dw-radius-xl)] overflow-hidden shadow-dw-shadow-lg ${className}`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className={`absolute inset-0 backface-hidden transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 text-center">
          <div className="w-16 h-20 mx-auto mb-6 relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[45%] bg-[#3E0A14] border-2 border-dw-border-gold rounded-br-[60%] rounded-bl-[60%] rounded-tr-[40%] rounded-tl-[40%]"></div>
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[12%] h-[22%] bg-[#5A4A3A] rounded"></div>
            <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-6 h-8 bg-[#FF9F00] rounded-full blur-sm animate-flicker" />
            <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-16 h-16 bg-[#d4af37]/40 rounded-full blur-md" style={{ animation: "dw-glow-pulse 4s ease-in-out infinite" }} />
          </div>
          <h1 className={`dw-text-2xl dw-text-ink font-heading font-bold mb-1`}>
            Happy Diwali, {recipientName}!
          </h1>
          <div className="w-32 h-1 bg-[#d4af37] mx-auto my-4 rounded" />
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <div className="flex flex-col gap-1">
              <span className="dw-text-xs dw-text-muted uppercase tracking-wider">Zodiac</span>
              <span className={`dw-text-lg dw-text-ink font-heading`}>{zodiacSign}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="dw-text-xs dw-text-muted uppercase tracking-wider">Lucky Color</span>
              <span className={`dw-text-lg dw-text-ink font-heading`}>{luckyColor}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="dw-text-xs dw-text-muted uppercase tracking-wider">Lucky Number</span>
              <span className={`dw-text-lg dw-text-ink font-heading`}>{luckyNumber}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="dw-text-xs dw-text-muted uppercase tracking-wider">Personality</span>
              <span className={`dw-text-lg dw-text-ink font-heading`}>{personalityTrait}</span>
            </div>
          </div>
          <p className={`dw-text-base italic dw-text-muted mb-4 max-w-xs`}>
            "{prediction}"
          </p>
          <p className={`dw-text-lg dw-text-ink font-medium leading-relaxed max-w-xs`}>
            {wishMessage}
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 text-center rotate-y-180"
          style={{ backgroundColor: "#0E0A1E", color: "#FFFFFF" }}
        >
          <h2 className="dw-text-xl font-heading font-bold mb-4">From the Heart</h2>
          <p className={`dw-text-base dw-text-muted mb-8 max-w-xs`}>
            This wish was created just for you, {recipientName}. May your Diwali be filled with light, joy, and prosperity.
          </p>
          <button
            onClick={onDownload}
            className="dw-bg-accent-gold dw-text-ink px-6 py-2 rounded-lg font-heading font-semibold hover:bg-[#e6c866] transition-colors shadow-dw-shadow-glow"
          >
            Download Card
          </button>
        </div>
      </motion.div>

      <button
        onClick={onFlip}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 dw-btn dw-btn--ghost dw-text-xs px-3 py-1.5 hover:bg-[#d4af37]/10 z-10"
      >
        {isFlipped ? "Flip Back" : "Flip Card"}
      </button>
    </motion.div>
  );
}

export default WishCard;
