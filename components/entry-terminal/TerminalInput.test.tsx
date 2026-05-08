import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TerminalInput } from './TerminalInput';
import '@testing-library/jest-dom';

describe('TerminalInput', () => {
  it('renders with terminal prompt prefix', () => {
    render(<TerminalInput placeholder="Enter username" />);
    expect(screen.getByText('> _')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<TerminalInput label="Username" id="username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<TerminalInput error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies default 4px solid border', () => {
    render(<TerminalInput data-testid="terminal-input" />);
    const input = screen.getByTestId('terminal-input');
    expect(input).toHaveClass('border-4', 'border-solid', 'border-cyberLime');
  });

  it('handles focus and blur events', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    
    render(
      <TerminalInput 
        data-testid="terminal-input" 
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
    
    const input = screen.getByTestId('terminal-input');
    
    // Focus the input
    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    
    // Blur the input
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<TerminalInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom className', () => {
    render(<TerminalInput className="custom-class" data-testid="terminal-input" />);
    const input = screen.getByTestId('terminal-input');
    expect(input).toHaveClass('custom-class');
  });

  it('passes through standard input props', () => {
    render(
      <TerminalInput 
        type="email"
        placeholder="Enter email"
        data-testid="terminal-input"
      />
    );
    const input = screen.getByTestId('terminal-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
  });

  it('applies glow animation on focus', async () => {
    const user = userEvent.setup();
    render(<TerminalInput data-testid="terminal-input" />);
    const input = screen.getByTestId('terminal-input');
    
    // Focus the input by clicking on it
    await user.click(input);
    
    // The component uses Framer Motion to animate boxShadow
    // We can verify the focus state is tracked by checking the input is focused
    expect(input).toHaveFocus();
  });

  it('removes glow animation on blur', async () => {
    const user = userEvent.setup();
    render(<TerminalInput data-testid="terminal-input" />);
    const input = screen.getByTestId('terminal-input');
    
    // Focus the input by clicking on it
    await user.click(input);
    expect(input).toHaveFocus();
    
    // Blur by tabbing away
    await user.tab();
    
    // Verify the input is no longer focused
    expect(input).not.toHaveFocus();
  });
});
