// Input — DiwaliWish UI Kit
// Token-driven: uses --dw-input-* tokens

export function Input({ type = "text", id, label, placeholder, value, onChange, required, className = "" }) {
  return (
    <div className={["dw-input-wrapper", className].filter(Boolean).join(" ")}>
      {label && (
        <label htmlFor={id} className="dw-input-label">
          {label}
          {required && <span className="dw-input-required" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        className="dw-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default Input;
