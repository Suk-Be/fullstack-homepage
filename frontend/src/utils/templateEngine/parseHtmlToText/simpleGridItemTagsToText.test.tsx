import SimpleGrid from '@/componentsTemplateEngine/presetRenderExamples/grids/SimpleGrid';
import simpleGridItemTagsToText from '@/utils/templateEngine/parseHtmlToText/simpleGridItemTagsToText';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('simpleGridItemTagsToText', () => {
  it('should return an array of HTML strings representing each grid item', () => {
    expect(Array.isArray(simpleGridItemTagsToText)).toBe(true);
    expect(simpleGridItemTagsToText.length).toBeGreaterThan(0);

    // Basic checks on each returned HTML string
    // console.log('htmlString: ', simpleGridItemTagsToText)
    for (const item of simpleGridItemTagsToText) {
      expect(typeof item).toBe('string');
      expect(item).toMatch(/div/);
      expect(item).toMatch(/class=["']/);
    }
  });

  it('should match rendered static HTML of SimpleGrid', () => {
    const rendered = renderToStaticMarkup(<SimpleGrid layoutGapConfig="gap-4" />);
    const expectedClass = 'w-full rounded-xl h-24 bg-gray-light';
    
    // Check whether parts of the output match rendered HTML
    for (const item of simpleGridItemTagsToText) {
      expect(rendered).toContain(item);
      expect(item).toContain(expectedClass);
    }
  });
});
