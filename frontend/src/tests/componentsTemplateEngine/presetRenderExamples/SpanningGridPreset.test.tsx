import SpanningGridPreset from '@/componentsTemplateEngine/presetRenderExamples/SpanningGridPreset';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('./ColSpanGrid', () => ({
    default: ({ layoutColSpanConfig }: { layoutColSpanConfig: string }) => (
        <div data-testid="mock-col-span-grid">
            Mocked ColSpanGrid rendered with config: {layoutColSpanConfig}
        </div>
    ),
}));

vi.mock('./RowspanGrid', () => ({
    default: () => <div data-testid="mock-row-span-grid">Mocked RowspanGrid rendered</div>,
}));

describe('SpanningGridPreset', () => {
    it('renders Headline and a tailwind col-span grid when layoutColSpanConfig is provided', () => {
        const headingText = 'Spanning Columns Example';
        const componentTestID = 'example-col-span';
        const layoutConfigValue = 'col-span-2';
        render(
            <SpanningGridPreset
                heading={headingText}
                layoutColSpanConfig={layoutConfigValue}
                testID={componentTestID}
            />,
        );

        expect(screen.getByRole('heading', { name: headingText })).toHaveTextContent(headingText);

        const gridContainerWithTestId = screen.getByTestId(componentTestID);
        expect(gridContainerWithTestId).toBeInTheDocument();

        const colSpanElements = gridContainerWithTestId.querySelectorAll(`.${layoutConfigValue}`);
        expect(colSpanElements).toHaveLength(3);
    });

    it('renders Headline and RowspanGrid when layoutColSpanConfig is not provided', () => {
        const headingText = 'Spanning Rows Example';
        const componentTestID = 'example-row-span';
        render(<SpanningGridPreset heading={headingText} testID={componentTestID} />);

        expect(screen.getByRole('heading', { name: headingText })).toHaveTextContent(headingText);

        const gridContainerWithTestId = screen.getByTestId(componentTestID);
        expect(gridContainerWithTestId).toBeInTheDocument();

        const gridRowElements = gridContainerWithTestId.querySelectorAll('.grid-rows-3');
        expect(gridRowElements).toHaveLength(1);

        const rowSpanElements = gridContainerWithTestId.querySelectorAll('.row-span-3');
        expect(rowSpanElements).toHaveLength(1);

        const colSpanElements = gridContainerWithTestId.querySelectorAll('.col-span-2');
        expect(colSpanElements).toHaveLength(2);
    });
});
