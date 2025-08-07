import RowspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/RowspanningGrid';
import rowSpanningGridItemTagsToText from '@/utils/templateEngine/parseHtmlToText/rowSpanningGridItemTagsToText';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('rowSpanningGridItemTagsToText', () => {
  it('should return an array of HTML strings representing each grid item', () => {
    expect(Array.isArray(rowSpanningGridItemTagsToText)).toBe(true);
    expect(rowSpanningGridItemTagsToText.length).toBeGreaterThan(0);

    // Basic checks on each returned HTML string
    // console.log('htmlString: ', rowSpanningGridItemTagsToText)
    for (const item of rowSpanningGridItemTagsToText) {
      expect(typeof item).toBe('string');
      expect(item).toMatch(/div/);
      expect(item).toMatch(/class=["']/);
    }
  });

  it('should contain the correct CSS classes for each grid item', () => {
    const expectedClasses = [
      'w-full rounded-xl p-12 bg-green-dark row-span-3',
      'w-full rounded-xl p-12 bg-green col-span-2',
      'w-full rounded-xl p-12 bg-green-dark/80 row-span-2 col-span-2',
    ];

    expect(rowSpanningGridItemTagsToText.length).toBe(expectedClasses.length);

    expectedClasses.forEach((expectedClass, index) => {
      const item = rowSpanningGridItemTagsToText[index];
      expect(item).toContain(expectedClass);
    });
  });

  it('should match rendered static HTML of SimpleGrid', () => {
    const rendered = renderToStaticMarkup(<RowspanningGrid />);
    
    // Check whether parts of the output match rendered HTML
    for (const item of rowSpanningGridItemTagsToText) {
      expect(rendered).toContain(item);
    }
  });
});
