import { useCallback, useState } from 'react';
/**
 * useBoolean
 *
 * Manages a boolean UI state with convenient helpers.
 *
 * ---
 * 🧠 Purpose
 * Simplifies common boolean UI patterns like open/close,
 * show/hide, enabled/disabled, loading states, etc.
 *
 * ---
 * ✅ Use this when
 * - Controlling dialogs, modals, popovers
 * - Toggling visibility (passwords, menus)
 * - Managing loading/submitting flags
 * - Working with Switch/Checkbox components
 *
 * ❌ Do NOT use when
 * - State is not boolean
 * - You need complex state logic (consider a state machine)
 *
 * ---
 * @param initial Initial boolean value (default: false)
 *
 * @returns
 * value — current state
 * setTrue/setFalse — explicit setters
 * toggle — invert value
 * onChange — Checkbox/Switch compatible handler
 *
 * ---
 * @example
 * const modal = useBoolean();
 * <Dialog open={modal.value} onClose={modal.setFalse} />
 *
 * @example
 * const darkMode = useBoolean(true);
 * <Switch checked={darkMode.value} onChange={darkMode.onChange} />
 */

export const useBoolean = (initial = false) => {
    const [value, setValue] = useState(initial);

    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);
    const toggle = useCallback(() => setValue((v) => !v), []);

    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.checked);
    }, []);

    return {
        value,
        setValue,
        setTrue,
        setFalse,
        toggle,
        onChange,
    } as const;
};
