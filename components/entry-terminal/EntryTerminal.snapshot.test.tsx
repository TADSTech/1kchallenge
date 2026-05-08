import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EntryTerminal } from './EntryTerminal';

describe('EntryTerminal Snapshot', () => {
  it('matches snapshot', () => {
    const { container } = render(<EntryTerminal />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
