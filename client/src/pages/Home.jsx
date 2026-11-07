import { Link } from "react-router-dom";
import { Fireworks } from "../components/Fireworks";
import { DiyaAnimation } from "../components/DiyaAnimation";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Fireworks count={20} />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-24">
        <DiyaAnimation size="lg" className="mb-8 mx-auto" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dw-text-4xl dw-text-ink font-heading mb-4 leading-tight"
        >
          Light up Diwali with a wish made just for{" "}
          <span className="dw-text-[#d4af37]">you</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dw-text-lg dw-text-muted max-w-2xl mx-auto mb-10 font-medium"
        >
          Enter your name and birthdate to receive a personalized Diwali
          greeting with zodiac sign, lucky color, lucky number, and a fun
          prediction.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          asChild
          className="dw-bg-accent-gold dw-text-ink px-8 py-3 rounded-lg font-heading font-bold text-lg hover:bg-[#e6c866] transition-colors shadow-dw-shadow-glow"
        >
          <Link to="/create">Create My Diwali Wish</Link>
        </motion.button>
      </div>
    </div>
  );
}
