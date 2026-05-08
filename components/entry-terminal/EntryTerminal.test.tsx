import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as authHooks from '@/lib/hooks/useAuth';
import * as firebaseAuthHooks from '@/lib/hooks/useFirebaseAuth';
import { EntryTerminal } from './EntryTerminal';

describe('EntryTerminal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it('shows loading indicator when auth is loading', () => {
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: true,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn(),
        login: vi.fn(),
        isLoading: false,
        error: null,
      });

      render(<EntryTerminal />);

      expect(screen.getByText('Loading authentication system...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows loading indicator when form is loading', () => {
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn(),
        login: vi.fn(),
        isLoading: true,
        error: null,
      });

      render(<EntryTerminal />);

      expect(screen.getByText('Loading authentication system...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows loading spinner animation during loading state', () => {
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: true,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn(),
        login: vi.fn(),
        isLoading: false,
        error: null,
      });

      render(<EntryTerminal />);

      const spinner = screen.getByText('⟳');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('success state', () => {
    it('shows success message after successful registration', async () => {
      const user = userEvent.setup();
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn().mockResolvedValue({}),
        login: vi.fn(),
        isLoading: false,
        error: null,
      });

      render(<EntryTerminal />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('[OK] Registration committed for testuser.')).toBeInTheDocument();
      });
    });

    it('shows success message in cyber lime color', async () => {
      const user = userEvent.setup();
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn().mockResolvedValue({}),
        login: vi.fn(),
        isLoading: false,
        error: null,
      });

      render(<EntryTerminal />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        const successMessage = screen.getByText('[OK] Registration committed for testuser.');
        expect(successMessage).toHaveClass('text-cyberLime');
      });
    });

    it('hides form fields after successful registration', async () => {
      const user = userEvent.setup();
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn().mockResolvedValue({}),
        login: vi.fn(),
        isLoading: false,
        error: null,
      });

      render(<EntryTerminal />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Email Address')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /commit to challenge/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('error state', () => {
    it('shows error message when registration fails', async () => {
      const user = userEvent.setup();
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn().mockRejectedValue(new Error('Registration failed')),
        login: vi.fn(),
        isLoading: false,
        error: 'Registration failed. Please try again.',
      });

      render(<EntryTerminal />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument();
      });
    });

    it('shows error message in alert orange color', async () => {
      const user = userEvent.setup();
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn().mockRejectedValue(new Error('Registration failed')),
        login: vi.fn(),
        isLoading: false,
        error: 'Registration failed. Please try again.',
      });

      render(<EntryTerminal />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('Registration failed. Please try again.');
        expect(errorMessage).toHaveClass('text-alertOrange');
      });
    });

    it('shows auth error message when auth hook has error', () => {
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: false,
        error: 'Authentication error occurred',
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn(),
        login: vi.fn(),
        isLoading: false,
        error: null,
      });

      render(<EntryTerminal />);

      expect(screen.getByText('Authentication error occurred')).toBeInTheDocument();
    });

    it('prioritizes form error over auth error when both present', () => {
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: null,
        authState: 'unauthenticated',
        isLoading: false,
        error: 'Auth error',
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn(),
        login: vi.fn(),
        isLoading: false,
        error: 'Form error',
      });

      render(<EntryTerminal />);

      expect(screen.getByText('Form error')).toBeInTheDocument();
      expect(screen.queryByText('Auth error')).not.toBeInTheDocument();
    });
  });

  describe('authenticated user state', () => {
    it('shows authenticated user message when user is logged in', () => {
      vi.spyOn(authHooks, 'useAuth').mockReturnValue({
        user: { uid: '123', email: 'user@example.com' },
        authState: 'authenticated',
        isLoading: false,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });
      vi.spyOn(firebaseAuthHooks, 'useFirebaseAuth').mockReturnValue({
        register: vi.fn(),
        login: vi.fn(),
        isLoading: false,
        error: null,
      });

      render(<EntryTerminal />);

      expect(screen.getByText('[OK] User authenticated: user@example.com')).toBeInTheDocument();
      expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    });
  });
});
