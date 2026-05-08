import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';

// Mock Firebase modules
vi.mock('../firebase', () => ({
  firebaseAuth: {},
  firebaseFirestore: {},
}));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

// Import after mocking
import { useFirebaseAuth } from './useFirebaseAuth';

describe('useFirebaseAuth - Error Handling', () => {
  describe('handleFirebaseError', () => {
    /**
     * Property 1: Error message mapping is correct
     * For any known Firebase error code, the handleFirebaseError function
     * should return the correct user-friendly message.
     * 
     * Validates: Requirements 1.4, 1.5, 4.1, 4.2, 4.3
     */
    it('should map known Firebase error codes to correct user-friendly messages', () => {
      const testCases = [
        {
          code: 'auth/email-already-in-use',
          expectedMessage: 'Email already registered. Please use a different email.',
        },
        {
          code: 'auth/invalid-email',
          expectedMessage: 'Invalid email address.',
        },
        {
          code: 'auth/weak-password',
          expectedMessage: 'Password should be at least 6 characters.',
        },
        {
          code: 'auth/user-not-found',
          expectedMessage: 'No account found with this email.',
        },
        {
          code: 'auth/wrong-password',
          expectedMessage: 'Incorrect password.',
        },
        {
          code: 'auth/network-request-failed',
          expectedMessage: 'Network error. Please check your connection and try again.',
        },
      ];

      testCases.forEach(({ code, expectedMessage }) => {
        const { result } = renderHook(() => useFirebaseAuth());
        
        act(() => {
          // @ts-expect-error - Simulating Firebase AuthError
          result.current.handleFirebaseError({ code });
        });
        
        expect(result.current.error).toBe(expectedMessage);
      });
    });

    /**
     * Property 1: Error message mapping is correct (property-based test)
     * For any known Firebase error code, the handleFirebaseError function
     * should return the correct user-friendly message.
     * 
     * Validates: Requirements 1.4, 1.5, 4.1, 4.2, 4.3
     */
    it('should map all known Firebase error codes to correct messages (property-based)', () => {
      // Define the mapping of error codes to expected messages
      const errorCodeMap = {
        'auth/email-already-in-use': 'Email already registered. Please use a different email.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/network-request-failed': 'Network error. Please check your connection and try again.',
      };

      // Generate arbitrary Firebase error codes and verify mapping
      fc.assert(
        fc.property(
          fc.oneof(
            ...Object.keys(errorCodeMap).map(code => fc.constant(code))
          ),
          (errorCode) => {
            const { result } = renderHook(() => useFirebaseAuth());
            
            act(() => {
              // @ts-expect-error - Simulating Firebase AuthError
              result.current.handleFirebaseError({ code: errorCode });
            });
            
            return result.current.error === errorCodeMap[errorCode as keyof typeof errorCodeMap];
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 1: Error message mapping is correct (generic case)
     * For any unknown Firebase error code, the handleFirebaseError function
     * should return the generic error message.
     * 
     * Validates: Requirement 4.3
     */
    it('should map unknown Firebase error codes to generic error message (property-based)', () => {
      // Generate arbitrary strings that are not valid Firebase error codes
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(code => {
            // Filter out known Firebase error codes
            const knownCodes = [
              'auth/email-already-in-use',
              'auth/invalid-email',
              'auth/weak-password',
              'auth/user-not-found',
              'auth/wrong-password',
              'auth/network-request-failed',
            ];
            return !knownCodes.includes(code) && !code.startsWith('auth/');
          }),
          (unknownCode) => {
            const { result } = renderHook(() => useFirebaseAuth());
            
            act(() => {
              // @ts-expect-error - Simulating Firebase AuthError
              result.current.handleFirebaseError({ code: unknownCode });
            });
            
            return result.current.error === 'Registration failed. Please try again.';
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 1: Error message mapping is correct (edge cases)
     * For edge cases like empty strings, special characters, and very long codes,
     * the handleFirebaseError function should return the generic error message.
     * 
     * Validates: Requirement 4.3
     */
    it('should handle edge cases with generic error message', () => {
      const edgeCases = [
        '',
        ' ',
        'auth/',
        'auth/unknown-error',
        'auth/some-random-error-code',
        'random-error',
        'ERROR_123',
        'auth/email-already-in-use-extra',
        'auth/email-already-in-use-substring',
        'a'.repeat(100), // Very long string
        '!@#$%^&*()', // Special characters
        '1234567890', // Numeric string
      ];

      edgeCases.forEach(code => {
        const { result } = renderHook(() => useFirebaseAuth());
        
        act(() => {
          // @ts-expect-error - Simulating Firebase AuthError
          result.current.handleFirebaseError({ code });
        });
        
        expect(result.current.error).toBe('Registration failed. Please try again.');
      });
    });
  });
});

describe('useFirebaseAuth - Loading State Transitions', () => {
  describe('Property 2: Loading state is managed correctly', () => {
    /**
     * Property 2: Loading state is true during registration/login operations
     * For any registration or login operation, the loading state should be true
     * while the operation is in progress.
     * 
     * Validates: Requirements 3.2, 3.3
     */
    it('should be true during registration operation', async () => {
      // Mock Firebase functions to return promises that resolve after a delay
      vi.mocked(createUserWithEmailAndPassword).mockImplementation(() => 
        new Promise((resolve, reject) => {
          setTimeout(() => reject({ code: 'auth/test-error' }), 100);
        }) as any
      );
      
      const { result } = renderHook(() => useFirebaseAuth());
      
      // Initially loading should be false
      expect(result.current.isLoading).toBe(false);
      
      // Start registration
      const registerPromise = result.current.register({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      });
      
      // Wait for loading to be set to true
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      }, { timeout: 2000 });
      
      // Complete the promise
      await registerPromise.catch(() => {});
      
      // Loading should be false after completion
      expect(result.current.isLoading).toBe(false);
    });

    /**
     * Property 2: Loading state is true during login operations
     * For any login operation, the loading state should be true
     * while the operation is in progress.
     * 
     * Validates: Requirements 3.2, 3.3
     */
    it('should be true during login operation', async () => {
      // Mock Firebase functions to return promises that resolve after a delay
      vi.mocked(signInWithEmailAndPassword).mockImplementation(() => 
        new Promise((resolve, reject) => {
          setTimeout(() => reject({ code: 'auth/test-error' }), 100);
        }) as any
      );
      
      const { result } = renderHook(() => useFirebaseAuth());
      
      // Initially loading should be false
      expect(result.current.isLoading).toBe(false);
      
      // Start login
      const loginPromise = result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
      
      // Wait for loading to be set to true
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      }, { timeout: 2000 });
      
      // Complete the promise
      await loginPromise.catch(() => {});
      
      // Loading should be false after completion
      expect(result.current.isLoading).toBe(false);
    });

    /**
     * Property 2: Loading state is false after completion (success or failure)
     * For any registration or login operation, the loading state should be false
     * after completion, regardless of success or failure.
     * 
     * Validates: Requirements 3.2, 3.3
     */
    it('should be false after operation completion (success or failure)', async () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('register'),
            fc.constant('login')
          ),
          fc.string({ minLength: 1, maxLength: 100 }).filter(email => email.includes('@')),
          fc.string({ minLength: 6, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          async (operationType, email, password, username) => {
            // Mock Firebase functions to return promises that resolve after a delay
            if (operationType === 'register') {
              vi.mocked(createUserWithEmailAndPassword).mockImplementation(() => 
                new Promise((resolve, reject) => {
                  setTimeout(() => reject({ code: 'auth/test-error' }), 100);
                }) as any
              );
            } else {
              vi.mocked(signInWithEmailAndPassword).mockImplementation(() => 
                new Promise((resolve, reject) => {
                  setTimeout(() => reject({ code: 'auth/test-error' }), 100);
                }) as any
              );
            }
            
            const { result } = renderHook(() => useFirebaseAuth());
            
            // Start operation
            let promise: Promise<any>;
            if (operationType === 'register') {
              promise = result.current.register({
                email,
                password,
                username,
              });
            } else {
              promise = result.current.login({ email, password });
            }
            
            // Wait for loading to be true (operation in progress)
            await waitFor(() => {
              expect(result.current.isLoading).toBe(true);
            }, { timeout: 2000 });
            
            // Wait for completion
            await promise.catch(() => {});
            
            // Loading should be false after completion
            expect(result.current.isLoading).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 50, timeout: 10000 }
      );
    });

    /**
     * Property 2: Loading state transitions follow correct sequence
     * For any sequence of operations, loading state should transition:
     * false -> true -> false
     * 
     * Validates: Requirements 3.2, 3.3
     */
    it('should follow correct transition sequence: false -> true -> false', async () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              fc.constant('register'),
              fc.constant('login')
            ),
            { minLength: 1, maxLength: 3 }
          ),
          fc.string({ minLength: 1, maxLength: 100 }).filter(email => email.includes('@')),
          fc.string({ minLength: 6, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          async (operations, email, password, username) => {
            // Mock Firebase functions to return promises that resolve after a delay
            vi.mocked(createUserWithEmailAndPassword).mockImplementation(() => 
              new Promise((resolve, reject) => {
                setTimeout(() => reject({ code: 'auth/test-error' }), 100);
              }) as any
            );
            vi.mocked(signInWithEmailAndPassword).mockImplementation(() => 
              new Promise((resolve, reject) => {
                setTimeout(() => reject({ code: 'auth/test-error' }), 100);
              }) as any
            );
            
            const { result } = renderHook(() => useFirebaseAuth());
            
            // Initial state should be false
            expect(result.current.isLoading).toBe(false);
            
            // Execute each operation
            for (const op of operations) {
              // Start operation
              let promise: Promise<any>;
              if (op === 'register') {
                promise = result.current.register({
                  email,
                  password,
                  username,
                });
              } else {
                promise = result.current.login({
                  email,
                  password,
                });
              }
              
              // Wait for loading to be true
              await waitFor(() => {
                expect(result.current.isLoading).toBe(true);
              }, { timeout: 2000 });
              
              // Wait for completion
              await promise.catch(() => {});
              
              // Loading should be false after each operation
              expect(result.current.isLoading).toBe(false);
            }
            
            return true;
          }
        ),
        { numRuns: 20, timeout: 10000 }
      );
    });

    /**
     * Property 2: Loading state is reset after error
     * For any operation that fails, the loading state should be reset to false
     * in the finally block, ensuring cleanup even on error.
     * 
     * Validates: Requirements 3.2, 3.3
     */
    it('should reset loading state after error occurs', async () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('auth/email-already-in-use'),
            fc.constant('auth/invalid-email'),
            fc.constant('auth/network-request-failed'),
            fc.string({ minLength: 1 }).filter(code => !code.startsWith('auth/'))
          ),
          async (errorCode) => {
            // Mock Firebase functions to throw the specified error
            vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce({
              code: errorCode,
            } as any);
            vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
              code: errorCode,
            } as any);
            
            const { result } = renderHook(() => useFirebaseAuth());
            
            // Start registration (will fail)
            const promise = result.current.register({
              email: 'test@example.com',
              password: 'password123',
              username: 'testuser',
            });
            
            // Wait for loading to be true during operation
            await waitFor(() => {
              expect(result.current.isLoading).toBe(true);
            }, { timeout: 2000 });
            
            // Wait for completion
            await promise.catch(() => {});
            
            // Loading should be reset to false after error
            expect(result.current.isLoading).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 50, timeout: 10000 }
      );
    });
  });
});

describe('useFirebaseAuth - Data Validation', () => {
  describe('Property 4: User data validation is enforced', () => {
    beforeEach(() => {
      // Reset mocks before each test
      vi.clearAllMocks();
    });

    /**
     * Property 4: Firestore document structure is correct
     * For any valid user registration, the Firestore document should have
     * the correct structure with username, email, and createdAt fields.
     * 
     * Validates: Requirements 5.4, 5.5
     */
    it('should store user data with correct Firestore document structure', async () => {
      // Setup mocks
      const mockSetDoc = vi.fn();
      const mockDoc = vi.fn();
      const mockServerTimestamp = vi.fn();

      vi.mock('../firebase', () => ({
        firebaseAuth: {},
        firebaseFirestore: {},
      }));

      vi.mock('firebase/auth', () => ({
        createUserWithEmailAndPassword: vi.fn(),
        signInWithEmailAndPassword: vi.fn(),
      }));

      vi.mock('firebase/firestore', () => ({
        doc: mockDoc,
        setDoc: mockSetDoc,
        serverTimestamp: mockServerTimestamp,
      }));

      // Re-import after mocking
      const { useFirebaseAuth } = require('./useFirebaseAuth');

      // Mock successful user credential
      const mockUserCredential = {
        user: {
          uid: 'test-uid-123',
          email: 'test@example.com',
        },
      };

      vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce(mockUserCredential as any);
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as any);
      vi.mocked(serverTimestamp).mockReturnValueOnce({ _methodName: 'serverTimestamp' } as any);

      const { result } = renderHook(() => useFirebaseAuth());

      await act(async () => {
        await result.current.register({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
        });
      });

      // Verify setDoc was called with correct document structure
      expect(mockSetDoc).toHaveBeenCalledTimes(1);
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(), // firebaseFirestore
        'users',
        'test-uid-123'
      );

      // Get the document data that was passed to setDoc
      const docCall = (mockSetDoc as any).mock.calls[0];
      const docData = docCall[2];

      // Verify document structure
      expect(docData).toHaveProperty('username');
      expect(docData).toHaveProperty('email');
      expect(docData).toHaveProperty('createdAt');

      // Verify username and email are non-empty strings
      expect(typeof docData.username).toBe('string');
      expect(docData.username.length).toBeGreaterThan(0);
      expect(typeof docData.email).toBe('string');
      expect(docData.email.length).toBeGreaterThan(0);

      // Verify createdAt is a timestamp
      expect(docData.createdAt).toBeDefined();
    });

    /**
     * Property 4: Username and email are non-empty strings
     * For any user document in Firestore, the username and email fields
     * should be non-empty strings.
     * 
     * Validates: Requirement 5.4
     */
    it('should validate that username and email are non-empty strings (property-based)', async () => {
      fc.assert(
        fc.property(
          // Generate arbitrary non-empty strings for username and email
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.includes('@')),
          fc.string({ minLength: 6, maxLength: 100 }),
          fc.string({ minLength: 5, maxLength: 20 }).filter(s => s.trim().length > 0),
          async (username, email, password, uid) => {
            // Setup mocks
            const mockSetDoc = vi.fn();
            const mockDoc = vi.fn();

            vi.mock('../firebase', () => ({
              firebaseAuth: {},
              firebaseFirestore: {},
            }));

            vi.mock('firebase/auth', () => ({
              createUserWithEmailAndPassword: vi.fn(),
              signInWithEmailAndPassword: vi.fn(),
            }));

            vi.mock('firebase/firestore', () => ({
              doc: mockDoc,
              setDoc: mockSetDoc,
              serverTimestamp: vi.fn(),
            }));

            // Re-import after mocking
            const { useFirebaseAuth } = require('./useFirebaseAuth');

            // Mock successful user credential
            const mockUserCredential = {
              user: {
                uid,
                email,
              },
            };

            vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce(mockUserCredential as any);
            vi.mocked(setDoc).mockResolvedValueOnce(undefined as any);

            const { result } = renderHook(() => useFirebaseAuth());

            await act(async () => {
              await result.current.register({
                email,
                password,
                username,
              });
            });

            // Verify setDoc was called
            expect(mockSetDoc).toHaveBeenCalledTimes(1);

            // Get the document data
            const docCall = (mockSetDoc as any).mock.calls[0];
            const docData = docCall[2];

            // Verify username and email are non-empty strings
            expect(typeof docData.username).toBe('string');
            expect(docData.username.length).toBeGreaterThan(0);
            expect(docData.username).toBe(username);

            expect(typeof docData.email).toBe('string');
            expect(docData.email.length).toBeGreaterThan(0);
            expect(docData.email).toBe(email);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 4: createdAt is a valid timestamp
     * For any user document in Firestore, the createdAt field
     * should be a valid Firestore timestamp.
     * 
     * Validates: Requirement 5.5
     */
    it('should validate that createdAt is a valid timestamp (property-based)', async () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.includes('@')),
          fc.string({ minLength: 6, maxLength: 100 }),
          fc.string({ minLength: 5, maxLength: 20 }).filter(s => s.trim().length > 0),
          async (username, email, password, uid) => {
            // Setup mocks
            const mockSetDoc = vi.fn();
            const mockDoc = vi.fn();
            const mockServerTimestamp = vi.fn();

            vi.mock('../firebase', () => ({
              firebaseAuth: {},
              firebaseFirestore: {},
            }));

            vi.mock('firebase/auth', () => ({
              createUserWithEmailAndPassword: vi.fn(),
              signInWithEmailAndPassword: vi.fn(),
            }));

            vi.mock('firebase/firestore', () => ({
              doc: mockDoc,
              setDoc: mockSetDoc,
              serverTimestamp: mockServerTimestamp,
            }));

            // Re-import after mocking
            const { useFirebaseAuth } = require('./useFirebaseAuth');

            // Mock successful user credential
            const mockUserCredential = {
              user: {
                uid,
                email,
              },
            };

            const mockTimestamp = { _methodName: 'serverTimestamp', _seconds: Date.now() / 1000 };
            vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce(mockUserCredential as any);
            vi.mocked(setDoc).mockResolvedValueOnce(undefined as any);
            vi.mocked(serverTimestamp).mockReturnValueOnce(mockTimestamp);

            const { result } = renderHook(() => useFirebaseAuth());

            await act(async () => {
              await result.current.register({
                email,
                password,
                username,
              });
            });

            // Verify serverTimestamp was called
            expect(mockServerTimestamp).toHaveBeenCalledTimes(1);

            // Verify setDoc was called with correct document structure
            expect(mockSetDoc).toHaveBeenCalledTimes(1);

            // Get the document data
            const docCall = (mockSetDoc as any).mock.calls[0];
            const docData = docCall[2];

            // Verify createdAt is a timestamp
            expect(docData.createdAt).toBeDefined();
            expect(docData.createdAt).toEqual(mockTimestamp);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 4: Edge cases for data validation
     * Test edge cases like whitespace-only strings, special characters,
     * and very long strings to ensure validation is robust.
     * 
     * Validates: Requirements 5.4, 5.5
     */
    it('should handle edge cases for data validation', async () => {
      const edgeCases = [
        { username: 'a', email: 'a@b.co', password: 'password123', uid: 'uid1' },
        { username: 'user with spaces', email: 'user@example.com', password: 'password123', uid: 'uid2' },
        { username: 'user-with-dashes', email: 'user@example.com', password: 'password123', uid: 'uid3' },
        { username: 'user_with_underscores', email: 'user@example.com', password: 'password123', uid: 'uid4' },
        { username: 'user123', email: 'user123@example.com', password: 'password123', uid: 'uid5' },
        { username: 'User@Email', email: 'user+tag@example.com', password: 'password123', uid: 'uid6' },
      ];

      for (const { username, email, password, uid } of edgeCases) {
        // Setup mocks for each test case
        const mockSetDoc = vi.fn();
        const mockDoc = vi.fn();
        const mockServerTimestamp = vi.fn();

        vi.mock('../firebase', () => ({
          firebaseAuth: {},
          firebaseFirestore: {},
        }));

        vi.mock('firebase/auth', () => ({
          createUserWithEmailAndPassword: vi.fn(),
          signInWithEmailAndPassword: vi.fn(),
        }));

        vi.mock('firebase/firestore', () => ({
          doc: mockDoc,
          setDoc: mockSetDoc,
          serverTimestamp: mockServerTimestamp,
        }));

        // Re-import after mocking
        const { useFirebaseAuth } = require('./useFirebaseAuth');

        // Mock successful user credential
        const mockUserCredential = {
          user: {
            uid,
            email,
          },
        };

        vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce(mockUserCredential as any);
        vi.mocked(setDoc).mockResolvedValueOnce(undefined as any);
        vi.mocked(serverTimestamp).mockReturnValueOnce({ _methodName: 'serverTimestamp' } as any);

        const { result } = renderHook(() => useFirebaseAuth());

        await act(async () => {
          await result.current.register({
            email,
            password,
            username,
          });
        });

        // Verify setDoc was called
        expect(mockSetDoc).toHaveBeenCalledTimes(1);

        // Get the document data
        const docCall = (mockSetDoc as any).mock.calls[0];
        const docData = docCall[2];

        // Verify username and email are non-empty strings
        expect(typeof docData.username).toBe('string');
        expect(docData.username.length).toBeGreaterThan(0);
        expect(docData.username).toBe(username);

        expect(typeof docData.email).toBe('string');
        expect(docData.email.length).toBeGreaterThan(0);
        expect(docData.email).toBe(email);

        // Verify createdAt is a timestamp
        expect(docData.createdAt).toBeDefined();
      }
    });
  });
});
