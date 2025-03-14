import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { usePostData } from "@/hooks/useApi";

type User = {
  id: string;
  fullName: string;
  email: string;
  isProfileVerified?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { mutate: loginUser, isPending: isLoginPending } = usePostData("auth/login/");

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log("parsedUser", parsedUser);
          setUser(parsedUser);

          // Check if first-time login and profile not verified
          if (parsedUser && !parsedUser.isProfileVerified) {
            // Redirect to profile setup
            router.replace("/profile/setup");
          }
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, we'll just create a mock user
      // const mockUser = {
      //   id: "user-123",
      //   fullName: "John Doe",
      //   email,
      //   isProfileVerified: false, // Set to false for first-time login
      const response = await loginUser({ email, password });
      // await AsyncStorage.setItem("user", JSON.stringify(response));
      console.log("response", response);
      // setUser(response);
      // Redirect to profile setup if not verified
      // if (!mockUser.isProfileVerified) {
      //   router.replace("/profile/setup");
      // }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, we'll just create a mock user
      const mockUser = {
        id: "us      er-" + Date.now(),
        fullName,
        email,
        isProfileVerified: false, // New users need to verify profile
      };

      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);

      // Redirect to profile setup
      router.replace("/profile/setup");
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...data };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
