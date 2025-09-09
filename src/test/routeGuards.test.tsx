
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RoleGuard from "@/components/ui/RoleGuard";
import Signup from "@/pages/Signup";
import AdminPage from "@/pages/Admin";
import { AuthProvider } from "@/contexts/AuthContext";

// Mock AuthContext for different roles
const mockUser = (role) => ({ id: "1", email: "test@test.com", role });


vi.mock("@/contexts/AuthContext", () => {
  const actual = vi.importActual("@/contexts/AuthContext");
  return {
    ...actual,
    useAuth: () => ({ user: mockUser("student"), isAuthenticated: true, loading: false }),
  };
});

describe("Route Guards", () => {
  it("allows teacher/student to access /signup", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <RoleGuard allowedRoles={["teacher", "student"]}>
            <Signup />
          </RoleGuard>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Signup page for teachers and students/i)).toBeInTheDocument();
  });

  it("blocks admin from /signup", () => {
  vi.spyOn(require("@/contexts/AuthContext"), "useAuth").mockReturnValue({ user: mockUser("admin"), isAuthenticated: true, loading: false });
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/signup"]}>
          <RoleGuard allowedRoles={["teacher", "student"]}>
            <Signup />
          </RoleGuard>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.queryByText(/Signup page for teachers and students/i)).not.toBeInTheDocument();
  });

  it("allows admin to access /admin", () => {
  vi.spyOn(require("@/contexts/AuthContext"), "useAuth").mockReturnValue({ user: mockUser("admin"), isAuthenticated: true, loading: false });
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/admin"]}>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminPage />
          </RoleGuard>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  it("blocks student from /admin", () => {
  vi.spyOn(require("@/contexts/AuthContext"), "useAuth").mockReturnValue({ user: mockUser("student"), isAuthenticated: true, loading: false });
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/admin"]}>
          <RoleGuard allowedRoles={["admin"]}>
            <AdminPage />
          </RoleGuard>
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.queryByText(/Admin Dashboard/i)).not.toBeInTheDocument();
  });
});
