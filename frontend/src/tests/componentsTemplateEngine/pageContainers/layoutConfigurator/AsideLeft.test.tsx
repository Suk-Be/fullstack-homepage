import AsideLeft from '@/componentsTemplateEngine/pageContainers/layoutConfigurator/AsideLeft';
import { render, screen } from '@testing-library/react';

describe('AsideLeft', () => {
    it('renders children and includes correct CSS classes and test ID', () => {
        const DummyComponent = () => <p>Testinhalt</p>;
        render(
            <AsideLeft>
                <DummyComponent />
            </AsideLeft>,
        );

        const container = screen.getByTestId('aside-left');
        const expectedClasses =
            'flex flex-col flex-wrap order-2 lg:order-1  rounded-lg  bg-gray-dark text-white  m-auto lg:m-0  w-full lg:w-1/6 p-8  lg:p-4  overflow-y-auto  max-h-full max-height: 95.3vh';

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass(expectedClasses);
        expect(container).toHaveTextContent('Testinhalt');
    });
});
