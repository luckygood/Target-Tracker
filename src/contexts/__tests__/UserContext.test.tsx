import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';
import { auth, signInWithGoogle, logout } from '../../firebase';

// Mock Firebase functions
jest.mock('../../firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  },
  signInWithGoogle: jest.fn(),
  logout: jest.fn(),
  handleFirestoreError: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  OperationType: {
    GET: 'get',
  },
}));

const TestComponent = () => {
  const { userProfile, isAuthReady, isFA, signIn, signOut, setUserRole } = useUser();
  return (
    <div>
      <div data-testid="user-profile">{userProfile?.displayName || 'No user'}</div>
      <div data-testid="is-auth-ready">{isAuthReady ? 'Ready' : 'Loading'}</div>
      <div data-testid="is-fa">{isFA ? 'FA' : 'Not FA'}</div>
      <button data-testid="sign-in" onClick={signIn}>Sign In</button>
      <button data-testid="sign-out" onClick={signOut}>Sign Out</button>
      <button data-testid="set-role" onClick={() => setUserRole('fa_admin')}>Set FA Admin Role</button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with initial state', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('user-profile')).toHaveTextContent('No user');
    expect(screen.getByTestId('is-auth-ready')).toHaveTextContent('Loading');
    expect(screen.getByTestId('is-fa')).toHaveTextContent('Not FA');
  });

  test('calls signInWithGoogle when signIn is called', async () => {
    const mockSignInResult = {
      user: {
        uid: '123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
      },
    };

    (signInWithGoogle as jest.Mock).mockResolvedValue(mockSignInResult);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.click(screen.getByTestId('sign-in'));

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalled();
    });
  });

  test('calls logout when signOut is called', async () => {
    (logout as jest.Mock).mockResolvedValue(undefined);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    fireEvent.click(screen.getByTestId('sign-out'));

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
    });
  });
});