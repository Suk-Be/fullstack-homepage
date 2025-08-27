import SimpleGridPreset from '@/componentsTemplateEngine/presetRenderExamples/SimpleGridGapPreset';
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

describe('SpanningGridGapPreset', () => {
    it('renders Headline and a tailwind gap-4 grid when layoutColSpanConfig is provided', () => {
        const headingText = 'Grid Example';
        const componentTestID = 'example-gap-4';
        const layoutConfigGapValue = 'gap-4';
        render(
            <SimpleGridPreset
                heading={headingText}
                layoutGapConfig={layoutConfigGapValue}
                testID={componentTestID}
            />,
        );

        expect(screen.getByRole('heading', { name: headingText })).toHaveTextContent(headingText);

        const gridContainerWithTestId = screen.getByTestId(componentTestID);
        expect(gridContainerWithTestId).toBeInTheDocument();

        const gap4Elements = gridContainerWithTestId.querySelectorAll(`.${layoutConfigGapValue}`);
        expect(gap4Elements).toHaveLength(1);
    });

    it('renders Headline and a tailwind gap-2 grid when layoutColSpanConfig is provided', () => {
        const headingText = 'Grid Example with smaller gap';
        const componentTestID = 'example-gap-2';
        const layoutConfigGapValue = 'gap-2';
        render(
            <SimpleGridPreset
                heading={headingText}
                layoutGapConfig={layoutConfigGapValue}
                testID={componentTestID}
            />,
        );

        expect(screen.getByRole('heading', { name: headingText })).toHaveTextContent(headingText);

        const gridContainerWithTestId = screen.getByTestId(componentTestID);
        expect(gridContainerWithTestId).toBeInTheDocument();

        const gap2Elements = gridContainerWithTestId.querySelectorAll(`.${layoutConfigGapValue}`);
        expect(gap2Elements).toHaveLength(2);
    });
});
