import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { wishAPI } from "../services/api";
import { ThemeSelector } from "./ThemeSelector";
import { DiyaAnimation } from "./DiyaAnimation";

const wishSchema = z.object({
  recipientName: z.string().min(2, "Name must be at least 2 characters"),
  birthdate: z.string().min(1, "Birthdate is required"),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  language: z.string().default("en"),
  theme: z.string().default("royal-gold"),
});

export default function WishForm() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [wishResult, setWishResult] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(wishSchema),
    defaultValues: {
      recipientName: "",
      birthdate: "",
      gender: "",
      language: "en",
      theme: "royal-gold",
    },
  });

  const theme = watch("theme");

  const onSubmit = async (data) => {
    setIsGenerating(true);
    try {
      const res = await wishAPI.generate(data);
      setWishResult(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate wish");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="dw-surface-paper border dw-border-default rounded-[var(--dw-radius-xl)] p-8 shadow-dw-shadow-lg">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Form */}
          <div className="flex-1 min-w-0">
            <DiyaAnimation size="lg" className="mx-auto mb-6" />
            <h2 className="dw-text-2xl dw-text-ink font-heading mb-2">
              Create Your Wish
            </h2>
            <p className="dw-text-muted mb-6">
              Enter your details to receive a personalized Diwali greeting.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="dw-label block mb-1">Recipient Name</label>
                <input
                  {...register("recipientName")}
                  className={`dw-input w-full ${
                    errors.recipientName ? "border-dc2626" : ""
                  }`}
                  placeholder="e.g., Aarav"
                />
                {errors.recipientName && (
                  <p className="dw-text-xs dw-text-[#dc2626] mt-1">
                    {errors.recipientName.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="dw-label block mb-1">Birthdate</label>
                  <input
                    type="date"
                    {...register("birthdate")}
                    className={`dw-input w-full ${
                      errors.birthdate ? "border-dc2626" : ""
                    }`}
                  />
                  {errors.birthdate && (
                    <p className="dw-text-xs dw-text-[#dc2626] mt-1">
                      {errors.birthdate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="dw-label block mb-1">Gender (optional)</label>
                  <select
                    {...register("gender")}
                    className="dw-input w-full"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="dw-label block mb-1">Language</label>
                <select
                  {...register("language")}
                  className="dw-input w-full"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                </select>
              </div>
              <ThemeSelector value={theme} onChange={(v) => setValue("theme", v)} />
              <button
                type="submit"
                disabled={isGenerating}
                className="dw-bg-accent-gold dw-text-ink w-full py-3 rounded-lg font-heading font-bold text-lg hover:bg-[#e6c866] transition-colors shadow-dw-shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate Wish"}
              </button>
            </form>
          </div>

          {/* Preview */}
          {wishResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-80"
            >
              <h3 className="dw-text-lg font-heading font-bold dw-text-ink mb-4">
                Your Greeting Card
              </h3>
              <div className="dw-surface-paper border dw-border-default rounded-lg p-4 mb-4">
                <div className="text-center">
                  <h4 className="dw-text-xl dw-text-ink font-heading mb-2">
                    Happy Diwali, {wishResult.recipientName}!
                  </h4>
                  <div className="flex justify-center gap-2 mb-2">
                    <span className="dw-text-xs dw-text-muted uppercase tracking-wider">Zodiac</span>
                    <span className="dw-text-base dw-text-ink font-heading">{wishResult.zodiacSign}</span>
                  </div>
                  <p className={`dw-text-sm italic dw-text-muted mb-2`}>
                    "{wishResult.prediction}"
                  </p>
                  <p className={`dw-text-base dw-text-ink font-medium`}>
                    {wishResult.wishMessage}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    wishAPI.share(wishResult.wishId).then(() =>
                      alert("Share count updated!")
                    )
                  }
                  className="dw-btn dw-btn--ghost flex-1"
                >
                  Share
                </button>
                <button
                  onClick={() =>
                    wishAPI.download(wishResult.wishId).then(() =>
                      alert("Download count updated!")
                    )
                  }
                  className="dw-btn dw-btn--primary flex-1 dw-text-xs"
                >
                  Download
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
