import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { FirebaseRegistrationForm } from './FirebaseRegistrationForm';

// Mock the useFirebaseAuth hook BEFORE importing the component
vi.mock('@/lib/hooks/useFirebaseAuth');

describe('FirebaseRegistrationForm', () => {
  const mockOnRegisterSuccess = vi.fn();
  const mockOnRegisterError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty Field Validation', () => {
    it('shows error message when username field is empty on blur', async () => {
      const user = userEvent.setup();
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');

      // Focus and blur without entering text
      await user.click(usernameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument();
      });

      const errorElement = screen.getByText('Username is required');
      expect(errorElement).toHaveClass('text-alertOrange');
    });

    it('shows error message when email field is empty on blur', async () => {
      const user = userEvent.setup();
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const emailInput = screen.getByLabelText('Email Address');

      // Focus and blur without entering text
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      const errorElement = screen.getByText('Email is required');
      expect(errorElement).toHaveClass('text-alertOrange');
    });

    it('shows error message when email format is invalid on blur', async () => {
      const user = userEvent.setup();
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const emailInput = screen.getByLabelText('Email Address');

      // Enter invalid email
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });

      const errorElement = screen.getByText('Invalid email format');
      expect(errorElement).toHaveClass('text-alertOrange');
    });

    it('shows error messages on submit when both fields are empty', async () => {
      const user = userEvent.setup();
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('does not display error when valid data is entered', async () => {
      const user = userEvent.setup();
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');

      // Enter valid data
      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
        expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
      });
    });
  });

  describe('Valid Submission Triggers Registration', () => {
    it('calls onRegisterSuccess with username when registration succeeds', async () => {
      const user = userEvent.setup();
      const mockRegister = vi.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@example.com', username: 'testuser' });
      
      vi.mocked(useFirebaseAuth).mockReturnValue({
        register: mockRegister,
        error: null,
      });

      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for the async operation to complete
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: expect.any(String),
          username: 'testuser',
        });
        expect(mockOnRegisterSuccess).toHaveBeenCalledWith('testuser');
      });
    });

    it('calls onRegisterError when registration fails', async () => {
      const user = userEvent.setup();
      const mockRegister = vi.fn().mockRejectedValue(new Error('Registration failed'));
      const mockError = 'Registration failed. Please try again.';
      
      vi.mocked(useFirebaseAuth).mockReturnValue({
        register: mockRegister,
        error: mockError,
      });

      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for the async operation to complete
      await waitFor(() => {
        expect(mockOnRegisterError).toHaveBeenCalledWith(mockError);
      });
    });

    it('generates a secure password for Firebase registration', async () => {
      const user = userEvent.setup();
      const mockRegister = vi.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@example.com', username: 'testuser' });
      
      vi.mocked(useFirebaseAuth).mockReturnValue({
        register: mockRegister,
        error: null,
      });

      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for the async operation to complete
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({
            password: expect.any(String),
          })
        );
        
        // Verify password is 16 characters
        const passwordArg = mockRegister.mock.calls[0][0].password;
        expect(passwordArg.length).toBe(16);
        
        // Verify password contains letters, numbers, and special characters
        expect(passwordArg).toMatch(/[a-z]/);
        expect(passwordArg).toMatch(/[A-Z]/);
        expect(passwordArg).toMatch(/[0-9]/);
        expect(passwordArg).toMatch(/[!@#$%^&*()_+]/);
      });
    });
  });

  describe('Loading State Disables Submit Button', () => {
    it('disables submit button during registration', async () => {
      const user = userEvent.setup();
      
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      
      // Click submit to trigger the loading state
      await user.click(submitButton);

      // Button should be disabled during loading (isRegistering state)
      expect(submitButton).toBeDisabled();
    });

    it('shows PROCESSING text during loading state', async () => {
      const user = userEvent.setup();
      
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      
      // Click submit to trigger the loading state
      await user.click(submitButton);

      // Check for PROCESSING text with spinner
      expect(screen.getByText('PROCESSING...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('re-enables submit button after registration completes', async () => {
      const user = userEvent.setup();
      const mockRegister = vi.fn().mockResolvedValue({ uid: 'test-uid', email: 'test@example.com', username: 'testuser' });
      
      vi.mocked(useFirebaseAuth).mockReturnValue({
        register: mockRegister,
        error: null,
      });

      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for the async operation to complete
      await waitFor(() => {
        // After completion, button should be enabled again
        expect(submitButton).toBeEnabled();
      });
    });
  });

  describe('Error Message Display', () => {
    it('displays error message in Alert Orange color', async () => {
      const user = userEvent.setup();
      const mockError = 'Email already registered. Please use a different email.';
      vi.mocked(useFirebaseAuth).mockReturnValue({
        register: vi.fn().mockRejectedValue(new Error('Error')),
        error: mockError,
      });

      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for the async operation to complete
      await waitFor(() => {
        const errorMessage = screen.getByText(mockError);
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveClass('text-alertOrange');
      });
    });

    it('displays generic error message when no specific error is provided', async () => {
      const user = userEvent.setup();
      vi.mocked(useFirebaseAuth).mockReturnValue({
        register: vi.fn().mockRejectedValue(new Error('Error')),
        error: null,
      });

      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for the async operation to complete
      await waitFor(() => {
        expect(screen.getByText('Registration failed')).toBeInTheDocument();
      });
    });

    it('does not display error message when there is no error', () => {
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      // Error message should not be present
      expect(screen.queryByText(/Email already registered|Invalid email|Network error|Registration failed/i)).not.toBeInTheDocument();
    });

    it('clears error message when user starts typing after error', async () => {
      const user = userEvent.setup();
      const mockError = 'Email already registered. Please use a different email.';
      vi.mocked(useFirebaseAuth).mockReturnValue({
        register: vi.fn().mockRejectedValue(new Error('Error')),
        error: mockError,
      });

      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');
      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for the async operation to complete
      await waitFor(() => {
        expect(screen.getByText(mockError)).toBeInTheDocument();
      });

      // Clear error by typing in username field
      await user.type(usernameInput, 'a');
      
      // Error should be cleared
      expect(screen.queryByText(mockError)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('submit button has aria-label for accessibility', () => {
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });
      expect(submitButton).toHaveAttribute('aria-label', 'Commit to challenge');
    });

    it('all form inputs have associated labels', () => {
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email Address');

      expect(usernameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();

      expect(usernameInput).toHaveAttribute('id', 'username');
      expect(emailInput).toHaveAttribute('id', 'email');
    });
  });

  describe('Form Structure', () => {
    it('renders username input field', () => {
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const usernameInput = screen.getByLabelText('Username');
      expect(usernameInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(usernameInput).toHaveAttribute('placeholder', 'Enter username');
      expect(usernameInput).toHaveAttribute('autoComplete', 'username');
    });

    it('renders email input field', () => {
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const emailInput = screen.getByLabelText('Email Address');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter email');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
    });

    it('renders submit button with correct styling', () => {
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      const submitButton = screen.getByRole('button', { name: /commit to challenge/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('renders hidden password input for Firebase Auth', () => {
      render(<FirebaseRegistrationForm onRegisterSuccess={mockOnRegisterSuccess} onRegisterError={mockOnRegisterError} />);

      // Find the password input by name attribute since it doesn't have a label
      const passwordInput = screen.getByDisplayValue('');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveClass('hidden');
    });
  });
});
