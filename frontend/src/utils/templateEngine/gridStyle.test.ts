import { GridStyleConfig } from '@/tests/mocks/data';
import {
    buildGridRenderPropsFromConfig,
    getGridItemsArrayFromConfig,
    getInlineStylesFromConfig,
} from '@/utils/templateEngine/gridStyle';

describe('gridStyle.ts', () => {
    describe('getInlineStylesFromConfig', () => {
        it('builds inline styles from config values', () => {
            const config = GridStyleConfig;

            const styles = getInlineStylesFromConfig(config);

            expect(styles).toEqual({
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '12px',
                borderWidth: 'calc(2rem/3)',
                padding: 'calc(8rem/2) calc(6rem/2)',
            });
        });
    });

    describe('getGridItemsArrayFromConfig', () => {
        it('creates a 1..N array from config.items', () => {
            const config = { items: 5 };
            expect(getGridItemsArrayFromConfig(config)).toEqual([1, 2, 3, 4, 5]);
        });

        it('accepts numeric strings for config.items', () => {
            const config = { items: '3' };
            expect(getGridItemsArrayFromConfig(config)).toEqual([1, 2, 3]);
        });

        it('returns an empty array when items is 0', () => {
            const config = { items: 0 };
            expect(getGridItemsArrayFromConfig(config)).toEqual([]);
        });

        it('returns an empty array when items is not a number', () => {
            const config = { items: 'nope' };
            expect(getGridItemsArrayFromConfig(config)).toEqual([]);
        });
    });

    describe('buildGridRenderPropsFromConfig', () => {
        it('returns inlineStyles + gridItemsArray in the expected shape', () => {
            const config = GridStyleConfig;

            const result = buildGridRenderPropsFromConfig(config);

            expect(result.inlineStyles).toEqual({
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '12px',
                borderWidth: 'calc(2rem/3)',
                padding: 'calc(8rem/2) calc(6rem/2)',
            });

            expect(result.gridItemsArray).toEqual([1, 2, 3, 4, 5]);
        });
    });
});
