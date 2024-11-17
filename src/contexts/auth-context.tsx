import api from "@/utils/services/api";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface User {
  id: string;
  username: string;
  email: string;
  country?: string;
  [key: string]: string | number | undefined;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  user: User;
}

interface UpdateCountryResponse {
  token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: Record<string, unknown>
  ) => Promise<{ success: boolean; data?: RegisterResponse; error?: string }>;
  logout: () => void;
  updateCountry: (
    country: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>("/user/login", {
        username,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const errorMessage = (
          error as { response?: { data?: { error?: string } } }
        ).response?.data?.error;
        return { success: false, error: errorMessage || "Login failed" };
      }
      return { success: false, error: "An unexpected error occurred" };
    }
  }, []);

  const register = useCallback(async (userData: Record<string, unknown>) => {
    try {
      const response = await api.post<RegisterResponse>(
        "/user/register",
        userData
      );
      return { success: true, data: response.data };
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const errorMessage = (
          error as { response?: { data?: { error?: string } } }
        ).response?.data?.error;
        return { success: false, error: errorMessage || "Registration failed" };
      }
      return { success: false, error: "An unexpected error occurred" };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const updateCountry = useCallback(async (country: string) => {
    try {
      const response = await api.post<UpdateCountryResponse>("/user/country", {
        country,
      });
      const { token: newToken, user: updatedUser } = response.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setToken(newToken);
      setUser(updatedUser);
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const errorMessage = (
          error as { response?: { data?: { error?: string } } }
        ).response?.data?.error;
        return { success: false, error: errorMessage || "Update failed" };
      }
      return { success: false, error: "An unexpected error occurred" };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, updateCountry }}
    >
      {children}
    </AuthContext.Provider>
  );
};
