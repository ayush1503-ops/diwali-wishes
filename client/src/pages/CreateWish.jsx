import { useAuth } from "../context/AuthContext";
import WishForm from "../components/WishForm";
import { Link } from "react-router-dom";

export default function CreateWish() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen dw-bg-midnight py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="dw-text-sm dw-text-muted flex items-center gap-2 hover:dw-accent-gold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="dw-surface-paper border dw-border-default rounded-[var(--dw-radius-xl)] p-8 shadow-dw-shadow-lg">
          <div className="mb-6">
            <h2 className="dw-text-2xl dw-text-ink font-heading mb-2">
              Create Your Wish
            </h2>
            <p className="dw-text-muted">
              Fill in your details to generate a personalized Diwali greeting
              card with zodiac prediction and lucky details.
            </p>
          </div>
          <WishForm />
        </div>

        {!isAuthenticated && (
          <div className="mt-8 text-center dw-text-muted">
            <p>
              Log in to save your wish to "My Wishes" and access it later.
            </p>
            <Link
              to="/login"
              className="dw-accent-gold hover:underline font-medium ml-2"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
