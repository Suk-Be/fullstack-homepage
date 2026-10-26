import { useState } from 'react';

/**
 * useInput
 *
 * Lightweight state management + input-compatible change handler
 * for single text-based form fields.
 *
 * ---
 * 🧠 Purpose
 * Manages a single string value and provides a ready-to-use
 * `onChange` handler for input or MUI TextField components.
 *
 * Optionally allows executing side effects whenever the value changes
 * (e.g. clearing validation errors).
 *
 * ---
 * ✅ Use this when
 * - Working with <TextField /> or <input /> elements
 * - Handling email, password, search, or general text inputs
 * - You want minimal boilerplate for controlled inputs
 * - You want to attach lightweight side-effects on change
 *
 * ❌ Do NOT use when
 * - Managing grouped form state (prefer object-based state)
 * - Handling checkbox arrays or multi-select (use dedicated hooks)
 * - Working with non-string state
 *
 * ---
 * @param initial
 * Initial input value (default: "")
 *
 * @param opts
 * Optional configuration object
 *
 * @param opts.onChange
 * Callback executed after internal state updates.
 * Receives the updated string value.
 *
 * Useful for:
 * - Clearing field-specific errors
 * - Triggering derived state
 * - Lightweight validation
 *
 * ---
 * @returns
 * value     — current input value
 * setValue  — manual state setter
 * onChange  — input-compatible change handler
 *
 * ---
 * @example
 * const email = useInput("");
 *
 * <TextField
 *   value={email.value}
 *   onChange={email.onChange}
 * />
 *
 * ---
 * @example
 * const password = useInput("", {
 *   onChange: () => clearFieldError("password"),
 * });
 *
 * <TextField
 *   value={password.value}
 *   onChange={password.onChange}
 * />
 */
const useInput = (initial = '', opts?: { onChange?: (value: string) => void }) => {
    const [value, setValue] = useState(initial);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setValue(next);
        opts?.onChange?.(next);
    };

    return { value, setValue, onChange } as const;
};

export { useInput };
