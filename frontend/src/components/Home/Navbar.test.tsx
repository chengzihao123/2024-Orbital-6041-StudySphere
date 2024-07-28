// src/components/Home/Navbar.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Navbar from './Navbar';
import { useAuth } from '../Auth/AuthContext';
import { useRouter } from 'next/navigation';

// Mock the useAuth hook
jest.mock('../Auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockStore = configureStore([]);
const initialState = {
  userInfo: {
    userId: '1',
    nickname: 'TestNick',
    yearOfStudy: '2',
    faculty: 'Engineering',
    major: 'Computer Science',
    hobby: 'Gaming',
    cca: 'Robotics',
    birthday: null,
    todayXP: 20,
    totalXP: 100,
  },
};

describe('Navbar Component', () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: 'testUserId' },
      logout: mockLogout,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const renderWithProvider = (ui: React.ReactElement, store: any) => {
    return render(<Provider store={store}>{ui}</Provider>);
  };

  test('renders Navbar for authenticated user', () => {
    const store = mockStore(initialState);

    renderWithProvider(<Navbar />, store);

    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('Study')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders Navbar for unauthenticated user', () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
    const store = mockStore(initialState);

    renderWithProvider(<Navbar />, store);

    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
