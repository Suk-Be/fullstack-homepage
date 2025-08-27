import {
  createHtmlAsTextFromPassedComponent,
  parseStringToADomModel,
  toTextClosingTagFrom,
  toTextOpeningTagFrom,
  toTextParentNode,
} from '@/utils/templateEngine/parseHtmlToText/index';
import { describe, expect, it } from 'vitest';

// Dummy-Komponente zum Testen
const TestComponent = () => (
  <div className="test-class" data-testid="test">
    <span>Hello</span>
    <span>World</span>
  </div>
);

describe('parseHtmlToText utilities', () => {
  it('createHtmlAsTextFromPassedComponent should return static HTML string', () => {
    const html = createHtmlAsTextFromPassedComponent(<TestComponent />);
    expect(typeof html).toBe('string');
    expect(html).toContain('class="test-class"');
    expect(html).toContain('<span>Hello</span>');
  });

  it('parseStringToADomModel should return a document', () => {
    const html = createHtmlAsTextFromPassedComponent(<TestComponent />);
    const dom = parseStringToADomModel(html);
    expect(dom).toBeInstanceOf(Document);
    expect(dom.body.innerHTML).toContain('class="test-class"');
  });

  it('toTextParentNode should return the outer div with no children', () => {
    const result = toTextParentNode(<TestComponent />);
    expect(result).toContain('<div class="test-class" data-testid="test"></div>');
    expect(result).not.toContain('<span>');
  });

  it('toTextOpeningTagFrom should return only opening tag', () => {
    const openingTag = toTextOpeningTagFrom(<TestComponent />);
    expect(openingTag).toBe('<div class="test-class" data-testid="test">');
  });

  it('toTextClosingTagFrom should return only closing tag', () => {
    const closingTag = toTextClosingTagFrom(<TestComponent />);
    expect(closingTag).toBe('</div>');
  });
});
