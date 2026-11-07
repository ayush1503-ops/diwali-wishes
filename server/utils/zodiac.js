/**
 * Calculate zodiac sign from birthdate (Date object).
 * Returns lowercase zodiac sign key.
 */
export function getZodiacSign(birthdate) {
  const month = birthdate.getMonth() + 1; // 1-12
  const day = birthdate.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
  return "pisces";
}

/**
 * Zodiac display names.
 */
export const ZODIAC_NAMES = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

/**
 * Lucky details mapped per zodiac sign.
 */
export const LUCKY_DETAILS = {
  aries: {
    color: "Red",
    number: 9,
    flower: "Honeysuckle",
    trait: "Bold Pioneer",
  },
  taurus: {
    color: "Green",
    number: 6,
    flower: "Lily",
    trait: "Steady Guardian",
  },
  gemini: {
    color: "Yellow",
    number: 5,
    flower: "Lavender",
    trait: "Curious Communicator",
  },
  cancer: {
    color: "Silver",
    number: 2,
    flower: "White Rose",
    trait: "Nurturing Heart",
  },
  leo: {
    color: "Gold",
    number: 1,
    flower: "Sunflower",
    trait: "Confident Leader",
  },
  virgo: {
    color: "Navy",
    number: 5,
    flower: "Chrysanthemum",
    trait: "Meticulous Healer",
  },
  libra: {
    color: "Pink",
    number: 6,
    flower: "Rose",
    trait: "Graceful Diplomat",
  },
  scorpio: {
    color: "Maroon",
    number: 8,
    flower: "Geranium",
    trait: "Intense Strategist",
  },
  sagittarius: {
    color: "Purple",
    number: 3,
    flower: "Carnation",
    trait: "Adventurous Explorer",
  },
  capricorn: {
    color: "Brown",
    number: 8,
    flower: "Pansy",
    trait: "Disciplined Achiever",
  },
  aquarius: {
    color: "Blue",
    number: 4,
    flower: "Orchid",
    trait: "Visionary Thinker",
  },
  pisces: {
    color: "Seafoam",
    number: 12,
    flower: "Water Lily",
    trait: "Creative Dreamer",
  },
};
