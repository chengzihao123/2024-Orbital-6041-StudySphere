// src/components/Home/HomePage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/components/Home/HomePage';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Auth/AuthContext';
import { act } from 'react-dom/test-utils';

// Mock the useRouter hook from next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/Auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('HomePage Component', () => {
  const mockPush = jest.fn();
  const mockSignup = jest.fn();
  const mockLoginWithGoogle = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: mockPush,
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      isFallback: false,
    });

    (useAuth as jest.Mock).mockReturnValue({
      signup: mockSignup,
      loginWithGoogle: mockLoginWithGoogle,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders sign-up form', () => {
    render(<HomePage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Profile Picture URL (optional)')).toBeInTheDocument();
  });

  test('handles sign-up submission successfully', async () => {
    mockSignup.mockResolvedValueOnce(undefined); // Mock successful signup

    render(<HomePage />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password' },
      });
      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'username' },
      });
      fireEvent.change(screen.getByPlaceholderText('Profile Picture URL (optional)'), {
        target: { value: 'http://example.com/profile.jpg' },
      });
      fireEvent.click(screen.getByText('Sign up with email'));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        'test@example.com',
        'password',
        'username',
        'http://example.com/profile.jpg'
      );
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  test('handles sign-up submission failure', async () => {
    mockSignup.mockRejectedValueOnce({ code: 'auth/invalid-email' }); // Mock failed signup

    render(<HomePage />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password' },
      });
      fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'username' },
      });
      fireEvent.change(screen.getByPlaceholderText('Profile Picture URL (optional)'), {
        target: { value: 'http://example.com/profile.jpg' },
      });
      fireEvent.click(screen.getByText('Sign up with email'));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        'test@example.com',
        'password',
        'username',
        'http://example.com/profile.jpg'
      );
      expect(screen.getByText('The email address is not valid.')).toBeInTheDocument();
    });
  });
});
