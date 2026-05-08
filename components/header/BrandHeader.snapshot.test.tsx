import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrandHeader } from './BrandHeader';

describe('BrandHeader snapshot', () => {
  it('matches snapshot with title and tagline text', () => {
    const { container } = render(<BrandHeader />);
    // Snapshot captures:
    // - Title: "TADS 1K CHALLENGE"
    // - Tagline: "Industrialize your hustle. Three months. One thousand dollars. Zero excuses."
    expect(container.firstChild).toMatchSnapshot();
  });
});
