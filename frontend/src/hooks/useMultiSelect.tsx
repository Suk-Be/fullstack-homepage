import { useState } from 'react';

/**
 * useMultiSelect
 *
 * Manages selection state for **checkbox-style multi selection**.
 *
 * ---
 * 🧠 Purpose
 * Provides helper methods for common UI patterns:
 * - `toggle(value, checked)` add/remove
 * - `has(value)` check if selected
 * - `selectAll(all)` / `clear()`
 * - `isAllSelected(all)` / `isSomeSelected(all)` for "Select all" checkboxes
 *
 * ---
 * ✅ Use this for checkbox groups (skills, tags, permissions).
 * - Working with FormGroup using multiple CheckBox
 *
 * ❌ Do NOT use this for MUI `<Select multiple />` value parsing.
 *    For MUI Select events (`string | string[]`) use `useSelectArray`.
 * - Select Option
 *
 * ---
 * @param initial Initial selected values.
 *
 * @returns
 * values — current input value
 * toggle — current input value
 * has — manual state setter
 * selectAll — input-compatible change handler
 * clear — current input value
 * isAllSelected — current input value
 * isSomeSelected — current input value
 * ---
 * @example
 * const skills = useMultiSelect<string>();
 *
 * <Checkbox
 *   checked={skills.has("CSS")}
 *   onChange={(_, checked) => skills.toggle("CSS", checked)}
 * />
 *
 * @example
 *
 * const all = ["HTML", "CSS", "JS"];
 *
 * <Checkbox
 *   checked={skills.isAllSelected(all)}
 *   indeterminate={skills.isSomeSelected(all)}
 *   onChange={(_, checked) => (checked ? skills.selectAll(all) : skills.clear())}
 * />
 */

export const useMultiSelect = <T,>(initial: T[] = []) => {
    const [values, setValues] = useState<T[]>(initial);

    const toggle = (value: T, checked: boolean) => {
        setValues((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)));
    };

    const has = (value: T) => values.includes(value);

    const selectAll = (all: T[]) => setValues(all);
    const clear = () => setValues([]);

    const isAllSelected = (all: T[]) => all.length > 0 && all.every((v) => values.includes(v));

    const isSomeSelected = (all: T[]) => values.length > 0 && !isAllSelected(all);

    return {
        values,
        toggle,
        has,
        selectAll,
        clear,
        isAllSelected,
        isSomeSelected,
    } as const;
};
