import AsideRight from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/AsideRight';
import { render, screen } from '@testing-library/react';

describe('AsideRight', () => {
    const renderUtils = () => {
        const DummyComponent = () => <p>Testinhalt</p>;
        render(
            <AsideRight>
                <DummyComponent />
            </AsideRight>,
        );

        const container = screen.getByTestId('aside-right');

        return {
            container,
        };
    };
    it('renders and includes correct CSS classes and test ID', () => {
        const { container } = renderUtils();

        const expectedClasses =
            'flex order-3 flex-wrap rounded-lg bg-gray-dark text-white m-auto lg:m-0 w-full lg:w-1/6 md:p-8 lg:p-4 border-2 overflow-y-auto max-h-full max-height: 95.3vh';

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass(expectedClasses);
        expect(container).toHaveTextContent('Testinhalt');
    });

    it('renders a child and correct CSS classes and test ID', () => {
        const { container } = renderUtils();

        const innerContainer = container.querySelector('div');
        expect(innerContainer).toBeInTheDocument();

        const expectedinnerContainerClasses =
            'w-full h-full mx-8 lg:mx-0 grid grid-cols-3 lg:grid-cols-1 gap-8';
        expect(innerContainer).toBeInTheDocument();
        expect(innerContainer).toHaveClass(expectedinnerContainerClasses);
        expect(innerContainer).toHaveTextContent('Testinhalt');
    });
});
