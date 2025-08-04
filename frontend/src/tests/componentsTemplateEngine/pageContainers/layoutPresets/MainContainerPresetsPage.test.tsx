import MainContainerPresets from '@/componentsTemplateEngine/pageContainers/layoutPresets/MainContainerPresetsPage';
import { render, screen } from '@testing-library/react';

describe('MainContainerPresetsPage', () => {
    it('renders children and includes correct CSS classes and test ID', () => {
        const DummyComponent = () => <p>Testinhalt</p>;
        render(
            <MainContainerPresets>
                <DummyComponent />
            </MainContainerPresets>,
        );

        const container = screen.getByTestId('main-container-presets');
        const expectedClasses =
            'flex-1 flex flex-col  p-4 pt-[6rem] lg:pt-[8rem] lg:p-10  w-full p-4 bg-white  gap-2 text-gray-700';

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass(expectedClasses);
        expect(container).toHaveTextContent('Testinhalt');
    });
});
