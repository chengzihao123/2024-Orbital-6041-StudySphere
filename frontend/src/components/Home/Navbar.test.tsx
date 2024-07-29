// src/components/Home/Navbar.test.tsx

import React from &aposreact&apos;
import { render, screen, fireEvent } from &apos@testing-library/react&apos;
import &apos@testing-library/jest-dom&apos;
import { Provider } from &aposreact-redux&apos;
import configureStore from &aposredux-mock-store&apos;
import Navbar from &apos./Navbar&apos;
import { useAuth } from &apos../Auth/AuthContext&apos;
import { useRouter } from &aposnext/navigation&apos;

// Mock the useAuth hook
jest.mock(&apos../Auth/AuthContext&apos, () => ({
  useAuth: jest.fn(),
}));

// Mock the useRouter hook
jest.mock(&aposnext/navigation&apos, () => ({
  useRouter: jest.fn(),
}));

const mockStore = configureStore([]);
const initialState = {
  userInfo: {
    userId: &apos1&apos,
    nickname: &aposTestNick&apos,
    yearOfStudy: &apos2&apos,
    faculty: &aposEngineering&apos,
    major: &aposComputer Science&apos,
    hobby: &aposGaming&apos,
    cca: &aposRobotics&apos,
    birthday: null,
    todayXP: 20,
    totalXP: 100,
  },
};

describe(&aposNavbar Component&apos, () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: &apostestUserId&apos },
      logout: mockLogout,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const renderWithProvider = (ui: React.ReactElement, store: any) => {
    return render(<Provider store={store}>{ui}</Provider>);
  };

  test(&aposrenders Navbar for authenticated user&apos, () => {
    const store = mockStore(initialState);

    renderWithProvider(<Navbar />, store);

    expect(screen.getByText(&aposTodos&apos)).toBeInTheDocument();
    expect(screen.getByText(&aposStudy&apos)).toBeInTheDocument();
    expect(screen.getByText(&aposCommunity&apos)).toBeInTheDocument();
    expect(screen.getByText(&aposLogout&apos)).toBeInTheDocument();
  });

  test(&aposrenders Navbar for unauthenticated user&apos, () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });
    const store = mockStore(initialState);

    renderWithProvider(<Navbar />, store);

    expect(screen.getByText(&aposLogin&apos)).toBeInTheDocument();
  });
});
