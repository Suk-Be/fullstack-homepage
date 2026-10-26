import UnitOfMeasurement from '@/componentsTemplateEngine/gridConfigurations/ui/ui-shared-comnponents/UnitOfMeasurement';
import { render, screen } from '@testing-library/react';

describe('UnitOfMeasurement', () => {
    it('renders fraction with provided numerator/denominator and suffix', () => {
        render(<UnitOfMeasurement unit="fraction" numerator={1} denominator={3} suffix="rem" />);

        expect(
            screen.getByText((_, el) => el?.tagName === 'P' && el.textContent === 'Unit: 1/3 rem'),
        ).toBeInTheDocument();
    });

    it('renders fraction with default rem suffix', () => {
        render(<UnitOfMeasurement unit="fraction" />);

        expect(
            screen.getByText((_, el) => el?.tagName === 'P' && el.textContent === 'Unit: 1/2 rem'),
        ).toBeInTheDocument();
    });

    it('renders px unit', () => {
        render(<UnitOfMeasurement unit="px" />);
        expect(screen.getByText('Unit: px')).toBeInTheDocument();
    });

    it('renders elements unit', () => {
        render(<UnitOfMeasurement unit="element" />);
        expect(screen.getByText('Unit: element')).toBeInTheDocument();
    });

    it('returns null for unknown unit (type-safety aside)', () => {
        // falls mal jemand "any" nutzt oder falsche Daten reinkommen
        const { container } = render(<UnitOfMeasurement unit={'nope' as any} />);

        expect(container).toBeEmptyDOMElement();
    });
});
