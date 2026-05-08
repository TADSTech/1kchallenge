import '@testing-library/jest-dom';

// Mock IntersectionObserver for Framer Motion whileInView
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock Firebase to prevent initialization errors during tests
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn().mockReturnValue([]),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));
