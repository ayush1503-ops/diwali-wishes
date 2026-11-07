/**
 * Prediction messages per zodiac sign for Diwali.
 */
export const PREDICTIONS = {
  aries: [
    "Your bold energy will light up new opportunities this Diwali season.",
    "Aries, your courage opens doors to unexpected prosperity this festive season.",
  ],
  taurus: [
    "Your steady dedication will bring lasting abundance into your home this Diwali.",
    "Taurus, your patience and hard work will be rewarded with sweet success.",
  ],
  gemini: [
    "Your curiosity and charm will connect you with wonderful people this Diwali.",
    "Gemini, your words will inspire and uplift everyone around you this season.",
  ],
  cancer: [
    "Your nurturing heart will create warm memories that last beyond Diwali.",
    "Cancer, your intuition will guide you toward joy and emotional fulfillment.",
  ],
  leo: [
    "Your confidence will shine as brightly as a thousand diyas this Diwali.",
    "Leo, your leadership will open exciting doors for prosperity and recognition.",
  ],
  virgo: [
    "Your meticulous care will bring order, peace, and abundance to your life.",
    "Virgo, your thoughtful planning will lead to beautiful outcomes this season.",
  ],
  libra: [
    "Your grace and diplomacy will bring harmony and joy to all your relationships.",
    "Libra, your balanced approach will attract prosperity and loving connections.",
  ],
  scorpio: [
    "Your intense passion will transform challenges into golden opportunities.",
    "Scorpio, your determination will unlock hidden doors to success this Diwali.",
  ],
  sagittarius: [
    "Your adventurous spirit will lead you to exciting new horizons this season.",
    "Sagittarius, your optimism will attract abundance and wonderful experiences.",
  ],
  capricorn: [
    "Your disciplined efforts will build a strong foundation for lasting prosperity.",
    "Capricorn, your ambition will be rewarded with recognition and abundance.",
  ],
  aquarius: [
    "Your visionary thinking will bring innovative ideas and unexpected blessings.",
    "Aquarius, your unique perspective will open doors to exciting possibilities.",
  ],
  pisces: [
    "Your creative dreams will manifest into beautiful realities this Diwali.",
    "Pisces, your compassionate heart will attract love and abundance everywhere.",
  ],
};

/**
 * Get a random prediction for a zodiac sign.
 */
export function getPrediction(zodiacSign) {
  const messages = PREDICTIONS[zodiacSign] || PREDICTIONS.leo;
  return messages[Math.floor(Math.random() * messages.length)];
}
