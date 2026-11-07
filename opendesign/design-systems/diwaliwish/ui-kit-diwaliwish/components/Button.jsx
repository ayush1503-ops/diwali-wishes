// Button — DiwaliWish UI Kit
// Token-driven: uses --dw-btn-* and --dw-accent-* tokens

export function Button({ variant = "primary", children, onClick, disabled, className = "" }) {
  const classes = [
    "dw-btn",
    `dw-btn--${variant}`,
    disabled ? "dw-btn--disabled" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
