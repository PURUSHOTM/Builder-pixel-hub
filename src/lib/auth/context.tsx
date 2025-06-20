import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { User, AuthState, LoginCredentials, SignupCredentials } from "../types";
import { AuthApi } from "../api/client";
import { toast } from "sonner";

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("authToken"),
  isAuthenticated: false,
  isLoading: true,
};

// Action types
type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "SET_ERROR"; payload: string };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

// Context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const response = await AuthApi.getCurrentUser();
          if (response.success) {
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                user: response.data as User,
                token,
              },
            });
          } else {
            // Invalid token, clear it
            localStorage.removeItem("authToken");
            dispatch({ type: "LOGOUT" });
          }
        } catch (error) {
          console.error("Failed to initialize auth:", error);
          localStorage.removeItem("authToken");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await AuthApi.login(credentials);

      if (response.success) {
        const { user, token } = response.data as { user: User; token: string };

        // Store token in localStorage
        localStorage.setItem("authToken", token);

        // Update state
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });

        toast.success("Welcome back!");
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Better error messages for different scenarios
      let errorMessage = "Login failed. Please try again.";

      if (error.message?.includes("Failed to fetch")) {
        errorMessage =
          "Unable to connect to server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw error;
    }
  };

  // Signup function
  const signup = async (credentials: SignupCredentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      if (credentials.password !== credentials.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { confirmPassword, ...signupData } = credentials;
      const response = await AuthApi.signup(signupData);

      if (response.success) {
        const { user, token } = response.data as { user: User; token: string };

        // Store token in localStorage
        localStorage.setItem("authToken", token);

        // Update state
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });

        toast.success("Account created successfully!");
      } else {
        throw new Error(response.error || "Signup failed");
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      // Better error messages for different scenarios
      let errorMessage = "Signup failed. Please try again.";

      if (error.message?.includes("Failed to fetch")) {
        errorMessage =
          "Unable to connect to server. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AuthApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear token from localStorage
      localStorage.removeItem("authToken");

      // Update state
      dispatch({ type: "LOGOUT" });

      toast.success("Logged out successfully");
    }
  };

  // Refresh user function
  const refreshUser = async () => {
    try {
      const response = await AuthApi.getCurrentUser();
      if (response.success) {
        dispatch({
          type: "UPDATE_USER",
          payload: response.data as User,
        });
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Protected route wrapper
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || <div>Please log in to access this page.</div>;
  }

  return <>{children}</>;
}

// Public route wrapper (redirects to dashboard if authenticated)
interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    window.location.href = "/dashboard";
    return null;
  }

  return <>{children}</>;
}
