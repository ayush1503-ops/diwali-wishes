import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { wishAPI } from "../services/api";
import { motion } from "framer-motion";
import { DiyaAnimation } from "../components/DiyaAnimation";

export default function GreetingCard() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [wish, setWish] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishAPI
      .getPublic(slug)
      .then((res) => {
        setWish(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/");
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen dw-bg-midnight flex items-center justify-center">
        <div className="dw-bg-accent-gold w-8 h-8 rounded-full animate-spin" />
      </div>
    );
  }

  if (!wish) return null;

  const handleDownload = () => {
    const element = document.getElementById("greeting-card");
    if (element) {
      // html2canvas download would go here
      alert("Card downloaded (preview mode)");
    }
    wishAPI.download(wish._id || wish.wishId);
  };

  return (
    <div className="min-h-screen dw-bg-midnight py-12 px-4">
      <nav className="max-w-5xl mx-auto mb-8 flex justify-between items-end">
        <Link
          to="/"
          className="dw-text-sm dw-text-muted flex items-center gap-2 hover:dw-accent-gold transition-colors"
        >
          ← Back to Home
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => wishAPI.share(wish._id || wish.wishId)}
            className="dw-btn dw-btn--ghost dw-text-xs px-3 py-1.5"
          >
            Share
          </button>
          <button
            onClick={handleDownload}
            className="dw-btn dw-btn--primary dw-text-xs px-3 py-1.5"
          >
            Download
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="dw-surface-paper border dw-border-default rounded-[var(--dw-radius-xl)] p-8 shadow-dw-shadow-xl"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <DiyaAnimation size="lg" className="mx-auto mb-6" />
              <h1 className="dw-text-3xl dw-text-ink font-heading text-center mb-6">
                Happy Diwali, {wish.recipientName}!
              </h1>
              <div className="w-48 h-1 bg-[#d4af37] mx-auto my-6 rounded" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <span className="dw-text-xs dw-text-muted uppercase tracking-wider block">
                    Zodiac Sign
                  </span>
                  <span className="dw-text-lg dw-text-ink font-heading">
                    {wish.zodiacSign}
                  </span>
                </div>
                <div className="text-center">
                  <span className="dw-text-xs dw-text-muted uppercase tracking-wider block">
                    Lucky Color
                  </span>
                  <span className="dw-text-lg dw-text-ink font-heading">
                    {wish.luckyColor}
                  </span>
                </div>
                <div className="text-center">
                  <span className="dw-text-xs dw-text-muted uppercase tracking-wider block">
                    Lucky Number
                  </span>
                  <span className="dw-text-lg dw-text-ink font-heading">
                    {wish.luckyNumber}
                  </span>
                </div>
                <div className="text-center">
                  <span className="dw-text-xs dw-text-muted uppercase tracking-wider block">
                    Personality
                  </span>
                  <span className="dw-text-lg dw-text-ink font-heading">
                    {wish.personalityTrait}
                  </span>
                </div>
              </div>
              <p className={`dw-text-lg italic dw-text-muted mb-6 text-center max-w-lg mx-auto`}>
                "{wish.prediction}"
              </p>
              <p className={`dw-text-xl dw-text-ink font-medium text-center leading-relaxed`}>
                {wish.wishMessage}
              </p>
            </div>
            <div className="flex-1 max-w-md">
              <div
                id="greeting-card"
                className={`dw-surface-paper border dw-border-default rounded-[var(--dw-radius-xl)] p-10 shadow-dw-shadow-lg ${isFlipped ? "rotate-y-180" : ""}`}
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  perspective: "1000px",
                  backgroundColor: isFlipped ? "#0E0A1E" : "#FFFFFF",
                  color: isFlipped ? "#FFFFFF" : "#1A0A2E",
                }}
              >
                {!isFlipped ? (
                  <>
                    <DiyaAnimation size="lg" className="mx-auto mb-6" />
                    <h2 className="dw-text-2xl dw-text-ink font-heading text-center mb-2">
                      Happy Diwali, {wish.recipientName}!
                    </h2>
                    <div className="w-32 h-1 bg-[#d4af37] mx-auto my-4 rounded" />
                    <p className="dw-text-base dw-text-ink text-center mb-4">
                      {wish.wishMessage}
                    </p>
                    <button
                      onClick={() => setIsFlipped(true)}
                      className="dw-bg-accent-gold dw-text-ink px-6 py-2 rounded-lg font-heading font-semibold hover:bg-[#e6c866] transition-colors mx-auto"
                    >
                      Flip Card
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="dw-text-xl font-heading font-bold text-center mb-4">
                      From the Heart
                    </h2>
                    <p className="dw-text-base dw-text-muted text-center mb-8 max-w-xs mx-auto">
                      This wish was created just for you,{isFlipped && " "}
                      {wish.recipientName}. May your Diwali be filled with
                      light, joy, and prosperity.
                    </p>
                    <button
                      onClick={() => setIsFlipped(false)}
                      className="dw-bg-accent-gold dw-text-ink px-6 py-2 rounded-lg font-heading font-semibold hover:bg-[#e6c866] transition-colors mx-auto"
                    >
                      Flip Back
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
