import { DynamicGridProps } from '@/types/templateEngine';
import { copyGridMarkupToClipboard } from '@/utils/templateEngine/markupClipboard';
import {
    createHtmlAsTextFromPassedComponent,
    parseStringToADomModel,
} from '@/utils/templateEngine/parseHtmlToText';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/templateEngine/parseHtmlToText', () => {
    return {
        createHtmlAsTextFromPassedComponent: vi.fn(),
        parseStringToADomModel: vi.fn(),
    };
});

describe('markupClipboard.tsx', () => {
    beforeEach(() => {
        vi.resetAllMocks();

        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined),
            },
        });
    });

    it('copies the parsed markup textContent to clipboard and returns it', async () => {
        (
            createHtmlAsTextFromPassedComponent as unknown as ReturnType<typeof vi.fn>
        ).mockReturnValue('<div>HELLO MARKUP</div>');

        (parseStringToADomModel as unknown as ReturnType<typeof vi.fn>).mockImplementation(
            (html: string) => new DOMParser().parseFromString(html, 'text/html'),
        );

        const inlineStyles: DynamicGridProps['inlineStyles'] = {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '12px',
            borderWidth: 'calc(1rem/3)',
            padding: 'calc(2rem/2) calc(2rem/2)',
        };
        const gridItemsArray: DynamicGridProps['gridItemsArray'] = [1, 2, 3];

        const text = await copyGridMarkupToClipboard(inlineStyles, gridItemsArray);

        expect(text).toBe('HELLO MARKUP');
        expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('HELLO MARKUP');
    });

    it('writes an empty string if no firstChild exists', async () => {
        (
            createHtmlAsTextFromPassedComponent as unknown as ReturnType<typeof vi.fn>
        ).mockReturnValue('');

        (parseStringToADomModel as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
            return new DOMParser().parseFromString('<body></body>', 'text/html');
        });

        const inlineStyles: DynamicGridProps['inlineStyles'] = {
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            gap: '0px',
            borderWidth: 'calc(0rem/3)',
            padding: 'calc(0rem/2) calc(0rem/2)',
        };
        const gridItemsArray: DynamicGridProps['gridItemsArray'] = [];

        const text = await copyGridMarkupToClipboard(inlineStyles, gridItemsArray);

        expect(text).toBe('');
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    });
});
