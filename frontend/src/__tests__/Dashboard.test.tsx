import { describe, test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../../src/pages/Dashboard";
import { useAuthStore } from "../../src/stores/auth.store";

describe("Dashboard Page", () => {
  test("Renders dashboard layout and shows user name", () => {
    useAuthStore.setState({ user: { id: "u1", email: "a@b.com", name: "Alice", role: "client" } as any });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome back, Alice/i)).toBeInTheDocument();
  });

  test("Displays project stats and recent projects", () => {
    const { container } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const scope = within(container);
    expect(scope.getAllByText(/Active Projects/i).length).toBeGreaterThan(0);
    expect(scope.getAllByText(/Recent Projects/i).length).toBeGreaterThan(0);
    expect(scope.getAllByText(/Sample App|Mobile Suite|API Gateway/i).length).toBeGreaterThan(0);
  });
});
