import ContentCenter from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/ContentCenter';
import { render, screen } from '@testing-library/react';

describe('ContentCenter', () => {
    it('renders with correct classes and children', () => {
        render(
            <ContentCenter>
                <p>Zentrierter Inhalt</p>
            </ContentCenter>,
        );

        const container = screen.getByTestId('content-center'); // Erwartete Tailwind-Klassen prüfen
        const expectedClasses =
            'flex order-1 lg:order-2 flex-col w-full lg:w-5/6 bg-gray-100 pt-[2rem] pb-[2rem] lg:pt-[8rem] justify-center items-center mb-4 lg:mb-0';

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass(expectedClasses);
        expect(container).toHaveTextContent('Zentrierter Inhalt');
    });
});
