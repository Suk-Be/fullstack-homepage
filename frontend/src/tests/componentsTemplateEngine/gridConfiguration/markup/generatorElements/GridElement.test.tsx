import GridElement from '@/componentsTemplateEngine/gridConfiguration/markUp/generatorElements/GridElement';
import { render, screen } from '@testing-library/react';

describe('GridElement', () => {
    it('renders with default Tailwind classes', () => {
        render(<GridElement />);

        const element = screen.getByTestId('grid-element');
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass('w-full');
        expect(element).toHaveClass('rounded-xl');
    });

    it('applies additional classNames merged via twMerge', () => {
        render(<GridElement className="bg-red-500 rounded-none" />);

        const element = screen.getByTestId('grid-element');
        expect(element).toHaveClass('w-full');
        expect(element).toHaveClass('bg-red-500');
        expect(element).not.toHaveClass('rounded-xl'); // overridden
        expect(element).toHaveClass('rounded-none'); // new
    });

    it('applies the given id attribute', () => {
        render(<GridElement id="my-grid-element" />);
        const element = screen.getByTestId('grid-element');
        expect(element).toHaveAttribute('id', 'my-grid-element');
    });
});
