import { ComponentPropsWithoutRef } from 'react';

export interface Props extends ComponentPropsWithoutRef<'p'> {
    unit: 'fraction' | 'px' | 'element';
    numerator?: number;
    denominator?: number;
    suffix?: 'rem' | 'px';
}

const UnitOfMeasurement = ({ unit, numerator, denominator, suffix = 'rem' }: Props) => {
    if (unit === 'fraction') {
        const top = numerator ?? 1;
        const bottom = denominator ?? 2;

        return (
            <p>
                Unit: <sup>{top}</sup>/<sub>{bottom}</sub> {suffix}
            </p>
        );
    }

    if (unit === 'px') return <p>Unit: px</p>;
    if (unit === 'element') return <p>Unit: element</p>;

    return null;
};

export default UnitOfMeasurement;
