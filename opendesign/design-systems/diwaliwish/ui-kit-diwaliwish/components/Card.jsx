// Card — DiwaliWish UI Kit
// Token-driven: uses --dw-card-* tokens. No colored left-border accent strips.

export function Card({ children, className = "", elevated = false, radius = "lg" }) {
  return (
    <div
      className={["dw-card", `dw-card--radius-${radius}`, elevated ? "dw-card--elevated" : "", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}

export default Card;
