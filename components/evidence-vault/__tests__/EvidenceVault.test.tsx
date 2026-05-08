import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EvidenceVault } from '../EvidenceVault';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>{children}</span>
    ),
    h3: ({ children, className, ...props }: any) => (
      <h3 className={className} {...props}>{children}</h3>
    ),
    button: ({ children, className, ...props }: any) => (
      <button className={className} {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('EvidenceVault Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders idle state by default', () => {
    render(<EvidenceVault />);
    expect(screen.getByText(/DROP PROOF TO ENCRYPT/i)).toBeInTheDocument();
  });

  it('triggers verification sequence on valid file drop', async () => {
    render(<EvidenceVault />);
    const dropZone = screen.getByText(/DROP PROOF TO ENCRYPT/i).closest('div');
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByText(/VERIFYING DATA INTEGRITY/i)).toBeInTheDocument();
  });

  it('shows error on invalid file type drop', () => {
    render(<EvidenceVault />);
    const dropZone = screen.getByText(/DROP PROOF TO ENCRYPT/i).closest('div');
    
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByText(/ACCESS DENIED/i)).toBeInTheDocument();
    expect(screen.getByText(/UNAUTHORIZED FORMAT: text\/plain/i)).toBeInTheDocument();
  });

  it('resets to idle after error timeout', async () => {
    render(<EvidenceVault />);
    const dropZone = screen.getByText(/DROP PROOF TO ENCRYPT/i).closest('div');
    
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByText(/ACCESS DENIED/i)).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(screen.getByText(/DROP PROOF TO ENCRYPT/i)).toBeInTheDocument();
  });

  it('file input accepts correct MIME types', () => {
    render(<EvidenceVault />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput.accept).toContain('image/png');
    expect(fileInput.accept).toContain('image/jpeg');
    expect(fileInput.accept).toContain('image/webp');
  });
});
