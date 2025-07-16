import { LabelHTMLAttributes } from 'react';
export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label {...props} className={`text-sm·text-red-600 ` + className}>
            {value ? value : children}
        </label>
    );
}
