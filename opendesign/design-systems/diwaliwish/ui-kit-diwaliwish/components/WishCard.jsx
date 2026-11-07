// WishCard — DiwaliWish UI Kit
// Greeting card display with zodiac, lucky details, prediction, and wish message

export function WishCard({
  recipientName = "Aarav",
  zodiacSign = "Leo",
  luckyColor = "Gold",
  luckyNumber = 7,
  personalityTrait = "Confident Leader",
  prediction = "Your confidence will open exciting doors for you this year.",
  wishMessage = "May your life shine as brightly as a thousand diyas. Wishing you happiness, prosperity, and beautiful memories.",
  theme = "royal-gold",
  className = "",
}) {
  const themeClasses = {
    "royal-gold": "dw-theme--royal-gold",
    "traditional-diya": "dw-theme--traditional-diya",
    "modern-neon": "dw-theme--modern-neon",
    rangoli: "dw-theme--rangoli",
    fireworks: "dw-theme--fireworks",
  };

  return (
    <article
      className={["dw-wish-card", `dw-wish-card--theme-${theme}`, themeClasses[theme] || "", className].filter(Boolean).join(" ")}
    >
      <div className="dw-wish-card__front">
        <div className="dw-wish-card__flap" />
        <div className="dw-wish-card__diya-wrapper">
          <DiyaAnimation size="lg" />
        </div>
        <h1 className="dw-wish-card__title">Happy Diwali, {recipientName}!</h1>
        <div className="dw-wish-card__divider" />
        <div className="dw-wish-card__details">
          <div className="dw-detail">
            <span className="dw-detail__label">Zodiac Sign</span>
            <span className="dw-detail__value">{zodiacSign}</span>
          </div>
          <div className="dw-detail">
            <span className="dw-detail__label">Lucky Color</span>
            <span className="dw-detail__value">{luckyColor}</span>
          </div>
          <div className="dw-detail">
            <span className="dw-detail__label">Lucky Number</span>
            <span className="dw-detail__value">{luckyNumber}</span>
          </div>
          <div className="dw-detail">
            <span className="dw-detail__label">Personality Trait</span>
            <span className="dw-detail__value">{personalityTrait}</span>
          </div>
        </div>
        <p className="dw-wish-card__prediction">{prediction}</p>
        <p className="dw-wish-card__wish">{wishMessage}</p>
      </div>
      <div className="dw-wish-card__back">
        <h2 className="dw-wish-card__back-title">From the Heart</h2>
        <p className="dw-wish-card__back-message">
          This wish was created just for you, {recipientName}. May your Diwali be filled with light, joy, and prosperity.
        </p>
        <button className="dw-btn dw-btn--primary dw-wish-card__download">
          Download Card
        </button>
      </div>
    </article>
  );
}

import DiyaAnimation from "./DiyaAnimation.jsx";

export default WishCard;
