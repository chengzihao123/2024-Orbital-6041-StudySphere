import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Study from "@/components/Study/Study";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsUserTime,
  setIsFullscreen,
  setCountdownSeconds,
} from "@/store/timerSlice";
import { useAuth } from "@/components/Auth/AuthContext";

// Mock hooks and actions
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@/store/timerSlice", () => ({
  setIsUserTime: jest.fn(),
  setIsFullscreen: jest.fn(),
  setCountdownSeconds: jest.fn(),
}));

jest.mock("@/components/Auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Study Component", () => {
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();
  const mockUseAuth = {
    currentUser: { uid: "123" },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: false,
          isUserTime: false,
        },
      })
    );
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);

    // Mock requestFullscreen
    global.Element.prototype.requestFullscreen = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();

    if ("requestFullscreen" in global.Element.prototype) {
      delete (global.Element.prototype as any).requestFullscreen;
    }
  });

  test("renders Study page and handles Start to Study button click", () => {
    render(<Study />);

    const startButton = screen.getByText("Start to Study");
    expect(startButton).toBeInTheDocument();

    fireEvent.click(startButton);

    expect(mockDispatch).toHaveBeenCalledWith(setIsUserTime(true));
  });

  test("shows alert when both minutes and seconds are zero", async () => {
    render(<Study />);

    fireEvent.click(screen.getByText("Start to Study"));

    // Mock useSelector to return updated state with isUserTime = true
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: false,
          isUserTime: true,
        },
      })
    );

    // Re-render the component to reflect the updated state
    render(<Study />);

    fireEvent.change(screen.getByPlaceholderText("0 minutes"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByPlaceholderText("0 seconds"), {
      target: { value: "0" },
    });
    fireEvent.submit(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(
        screen.getByText("Time can't be set as 0. Please enter a valid time.")
      ).toBeInTheDocument();
    });
  });

  test("handles form submission and enters fullscreen mode", async () => {
    render(<Study />);

    fireEvent.click(screen.getByText("Start to Study"));

    // Mock useSelector to return updated state with isUserTime = true
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: false,
          isUserTime: true,
        },
      })
    );

    // Re-render the component to reflect the updated state
    render(<Study />);

    fireEvent.change(screen.getByPlaceholderText("0 minutes"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByPlaceholderText("0 seconds"), {
      target: { value: "30" },
    });
    fireEvent.submit(screen.getByText("Confirm"));

    // Find the closest element to the Confirm button and ensure it has requestFullscreen
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setCountdownSeconds(90));
      expect(mockDispatch).toHaveBeenCalledWith(setIsUserTime(true));
      expect(mockDispatch).toHaveBeenCalledWith(setIsFullscreen(true));
      expect(global.Element.prototype.requestFullscreen).toHaveBeenCalled();
    });
  });

  // test for Go back button
  test("handles going back to the home page", async () => {
    render(<Study />);
    fireEvent.click(screen.getByText("Go back"));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });
});
