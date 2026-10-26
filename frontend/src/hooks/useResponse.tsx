import { useState } from 'react';

/**
 * useResponse
 *
 * Manages success and error response messages with a small,
 * structured API.
 *
 * ---
 * 🧠 Purpose
 * Provides a centralized and explicit way to manage response
 * feedback (e.g. server responses) in UI components.
 *
 * Keeps success and error messages separated while allowing
 * independent or combined resets.
 *
 * ---
 * ✅ Use this when
 * - Displaying server response messages (success or error)
 * - Handling global (non-field-specific) form feedback
 * - You want a small, consistent message namespace
 * - Managing transient UI feedback states
 *
 * ❌ Do NOT use when
 * - You only need a single primitive useState
 * - Errors are strictly field-based (use dedicated field error state)
 * - Complex async state management is required (consider useAsync or a reducer)
 *
 * ---
 * @returns
 * success.value — current success message (string | null)
 * success.set   — set success message
 * success.clear — clear success message
 *
 * error.value   — current error message (string | null)
 * error.set     — set error message
 * error.clear   — clear error message
 *
 * clear         — clears both success and error messages
 *
 * ---
 * @example
 * const res = useResponse();
 *
 * res.error.set("Login fehlgeschlagen");
 *
 * {res.error.value && (
 *   <Typography color="error">
 *     {res.error.value}
 *   </Typography>
 * )}
 *
 * ---
 * @example
 * const res = useResponse();
 *
 * const handleSubmit = async () => {
 *   res.clear();
 *   const result = await request();
 *
 *   if (result.success) {
 *     res.success.set("Erfolgreich gespeichert");
 *   } else {
 *     res.error.set(result.message);
 *   }
 * };
 */

export const useResponse = () => {
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    return {
        success: {
            value: success,
            set: setSuccess,
            clear: () => setSuccess(null),
        },
        error: {
            value: error,
            set: setError,
            clear: () => setError(null),
        },
        clear: () => {
            setSuccess(null);
            setError(null);
        },
    };
};
