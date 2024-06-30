import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FullScreenTopBar } from "./FullScreenTopBar";
import { setIsFullscreen } from "@/store/timerSlice";

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
}));

jest.mock("@/components/Study/Timer", () => {
  return ({
    initialTime,
    onTimeUp,
  }: {
    initialTime: number;
    onTimeUp: () => void;
  }) => {
    // Mock CountdownTimer component
    setTimeout(() => {
      onTimeUp();
    }, initialTime * 1000); // Simulate timer reaching zero
    return <div>Mock CountdownTimer</div>;
  };
});

jest.mock("next/link", () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      onClick={() => {
        useRouter().push(href);
      }}
    >
      {children}
    </a>
  );
});

describe("FullScreenTopBar Component", () => {
  const mockPush = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        timer: {
          isFullscreen: true,
          countdownSeconds: 10,
          isUserTime: false,
        },
      })
    );

    global.document.exitFullscreen = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //   test("handles time up correctly", async () => {
  //     render(<FullScreenTopBar />);

  //     await waitFor(() => {
  //       //   expect(global.document.exitFullscreen).toHaveBeenCalled();
  //       expect(mockDispatch).toHaveBeenCalledWith(setIsFullscreen(false));
  //       //   expect(mockPush).toHaveBeenCalledWith("/study");
  //     });
  //   });

  //   test("handles End Study button click correctly", async () => {
  //     render(<FullScreenTopBar />);

  //     fireEvent.click(screen.getByText("End Study"));

  //     await waitFor(() => {
  //       //   expect(global.document.exitFullscreen).toHaveBeenCalled();
  //         expect(mockDispatch).toHaveBeenCalledWith(setIsFullscreen(false));
  //     //   expect(mockPush).toHaveBeenCalledWith("/study");
  //     });
  //   });

  test("handles None tab click correctly", () => {
    render(<FullScreenTopBar />);

    fireEvent.click(screen.getByText("None"));

    expect(mockPush).toHaveBeenCalledWith("/study/background");
    expect(mockDispatch).not.toHaveBeenCalledWith(setIsFullscreen(false));
  });

  test("handles Todo tab click correctly", () => {
    render(<FullScreenTopBar />);

    fireEvent.click(screen.getByText("Todo"));

    expect(mockPush).toHaveBeenCalledWith("/todos");
    expect(mockDispatch).not.toHaveBeenCalledWith(setIsFullscreen(false));
  });

  test("handles Community tab click correctly", () => {
    render(<FullScreenTopBar />);

    fireEvent.click(screen.getByText("Community"));

    expect(mockPush).toHaveBeenCalledWith("/chatrooms");
    expect(mockDispatch).not.toHaveBeenCalledWith(setIsFullscreen(false));
  });
});
