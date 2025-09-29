import MainContainer from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/MainContainer';
import { render, screen } from '@testing-library/react';

describe('MainContainer', () => {
    it('renders with correct classes and children', () => {
        render(
            <MainContainer>
                <p>Hauptinhalt</p>
            </MainContainer>,
        );

        const container = screen.getByTestId('main-container');
        const expectedClasses =
            'flex-1 flex md:gap-2 pt-[4rem] md:pt-[6rem] lg:pt-[8rem] lg:p-10 flex-col lg:flex-row full bg-white text-gray-700';

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass(expectedClasses);
        expect(container).toHaveTextContent('Hauptinhalt');
    });
});
