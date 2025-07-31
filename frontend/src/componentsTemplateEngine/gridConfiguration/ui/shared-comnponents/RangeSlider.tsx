import { testId } from '@/utils/testId';
import { Field, Input } from '@headlessui/react';
import { ChangeEventHandler, ComponentPropsWithoutRef, FC, ReactNode } from 'react';

export interface RangeSliderProps extends ComponentPropsWithoutRef<'input'> {
    min?: string;
    max?: string;
    step?: string;
    disabled?: boolean;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    children: ReactNode;
    placeholder: string;
}
const RangeSlider: FC<RangeSliderProps> = ({
    min = '0',
    max = '11',
    step = '1',
    disabled,
    value,
    onChange,
    children,
    placeholder,
}) => {
    return (
        <Field className="flex flex-col pb-4">
            <div className="font-normal pb-2">
                {children}
                <span
                    className="
                      rounded 
                      bg-white text-gray-dark 
                      px-2 py-0.5 
                      inline-block"
                    {...testId(`${placeholder}-display-value`)}
                >
                    {value}
                </span>
            </div>
            <Input
                type="range"
                min={min}
                max={max}
                step={step}
                className="range range-sm"
                autoComplete="off"
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                {...testId(`${placeholder}-value`)}
            />
        </Field>
    );
};

export default RangeSlider;
