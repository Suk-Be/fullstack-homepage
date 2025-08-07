import ColspanningGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/ColspanningGrid';
import colSpanningGridItemTagsToText from '@/utils/templateEngine/parseHtmlToText/colSpanningGridItemTagsToText';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('colSpanningGridItemTagsToText', () => {
  it('should return an array of HTML strings representing each grid item', () => {
    expect(Array.isArray(colSpanningGridItemTagsToText)).toBe(true);
    expect(colSpanningGridItemTagsToText.length).toBeGreaterThan(0);

    // Basic checks on each returned HTML string
    // console.log('htmlString: ', colSpanningGridItemTagsToText)
    for (const item of colSpanningGridItemTagsToText) {
      expect(typeof item).toBe('string');
      expect(item).toMatch(/div/);
      expect(item).toMatch(/class=["']/);
    }
  });

  it('should contain the correct CSS classes for each grid item', () => {
    const expectedClasses = [
      'w-full rounded-xl h-24 bg-green-dark',
      'w-full rounded-xl h-24 bg-green col-span-2',
      "w-full rounded-xl h-24 bg-green col-span-2",
      "w-full rounded-xl h-24 bg-green-dark",
      "w-full rounded-xl h-24 bg-green-dark",
      "w-full rounded-xl h-24 bg-green col-span-2"
    ];

    expect(colSpanningGridItemTagsToText.length).toBe(expectedClasses.length);

    expectedClasses.forEach((expectedClass, index) => {
      const item = colSpanningGridItemTagsToText[index];
      expect(item).toContain(expectedClass);
    });
  });

  it('should match rendered static HTML of SimpleGrid', () => {
    const rendered = renderToStaticMarkup(<ColspanningGrid layoutConfig="col-span-2" />);
    
    // Check whether parts of the output match rendered HTML
    for (const item of colSpanningGridItemTagsToText) {
      expect(rendered).toContain(item);
    }
  });
});
