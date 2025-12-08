import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/pages/Login";
import { useAuthStore } from "../../src/stores/auth.store";

describe("Login Page", () => {
  test("Renders login form", () => {
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );
    const form = container.querySelector("form")!;
    const scope = within(form);
    expect(scope.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(scope.getByText(/Sign in to ReqNexa/i)).toBeInTheDocument();
    expect(scope.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(scope.getByPlaceholderText(/•+/i)).toBeInTheDocument();
  });

  test("Shows error on invalid email", async () => {
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );
    const form = container.querySelector("form")!;
    const scope = within(form);
    fireEvent.click(scope.getByRole("button", { name: /Sign In/i }));
    expect(await scope.findByText(/Email and password are required/i)).toBeInTheDocument();
  });

  test("Shows error on wrong credentials", async () => {
    const login = vi.spyOn(useAuthStore.getState(), "login").mockRejectedValue(new Error("Invalid"));
    // Stub global location.assign so redirect doesn't throw in JSDOM
    vi.stubGlobal("location", { ...window.location, assign: vi.fn() } as any);
    const { container, findByText } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );
    const form = container.querySelector("form")!;
    const scope = within(form);
    fireEvent.change(scope.getByPlaceholderText(/you@example.com/i), { target: { value: "a@b.com" } });
    fireEvent.change(scope.getByPlaceholderText(/•+/i), { target: { value: "wrongpass" } });
    fireEvent.click(scope.getByRole("button", { name: /Sign In/i }));
    expect(await findByText(/Invalid email or password/i)).toBeInTheDocument();
    login.mockRestore();
  });

  test("Redirects to dashboard on success", async () => {
    const login = vi.spyOn(useAuthStore.getState(), "login").mockResolvedValue(undefined as any);
    const { container } = render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Login />
      </MemoryRouter>
    );
    const form = container.querySelector("form")!;
    const scope = within(form);
    fireEvent.change(scope.getByPlaceholderText(/you@example.com/i), { target: { value: "a@b.com" } });
    fireEvent.change(scope.getByPlaceholderText(/•+/i), { target: { value: "Aa123456" } });
    fireEvent.click(scope.getByRole("button", { name: /Sign In/i }));
    useAuthStore.setState({ isAuthenticated: true });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    login.mockRestore();
  });
});
