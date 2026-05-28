import { useRef } from "react";

export default function PinInput({ value, onChange, length = 4, showPin, label, showToggle, onToggle }) {
  const refs = useRef([]);

  const handleChange = (index, val) => {
    if (val.length > 1) val = val.slice(-1);
    if (!/^\d*$/.test(val)) return;
    const updated = [...value];
    updated[index] = val;
    onChange(updated);
    if (val && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="flex gap-3">
        {value.map((digit, i) => (
          <input
            key={`${label}-${i}`}
            ref={(el) => (refs.current[i] = el)}
            type={showPin ? "text" : "password"}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-14 h-14 bg-[#111622] border border-gray-800 rounded-lg text-center text-xl font-bold text-gray-200 placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
            placeholder="·"
            autoComplete="off"
          />
        ))}
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="ml-2 text-gray-500 hover:text-gray-300 transition-colors self-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showPin ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
