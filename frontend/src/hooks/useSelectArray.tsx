import { useCallback, useState } from 'react';

type ValueEvent =
    | { target: { value: string | string[] } }
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

/**
 * useSelectArray
 *
 * Normalizes and stores the value of a **multiple select** as `string[]`.
 *
 * Works with:
 * - MUI `<Select multiple />`
 * - MUI `<TextField select />` with `multiple: true`
 *
 * MUI may provide `event.target.value` as `string | string[]`
 * (e.g. autofill can return a comma-separated string).
 * This hook always converts it to `string[]`.
 *
 * ✅ Use this when you only need the selected values.
 * ❌ Do NOT use this for checkbox-group selection logic (toggle/selectAll/has).
 *    For that, use `useMultiSelect`.
 *
 * @param initial Initial selected values.
 *
 * @example
 * const countries = useSelectArray();
 *
 * <Select multiple value={countries.value} onChange={countries.onChange} />
 *
 * @example
 * const countries = useSelectArray();
 *
 * <TextField
 *   select
 *   value={countries.value}
 *   onChange={countries.onChange}
 *   slotProps={{ select: { multiple: true } }}
 * />
 */

export const useSelectArray = (initial: string[] = []) => {
    const [value, setValue] = useState<string[]>(initial);

    const onChange = useCallback((event: ValueEvent) => {
        const v = event.target.value;
        setValue(typeof v === 'string' ? v.split(',') : v);
    }, []);

    return { value, setValue, onChange } as const;
};
