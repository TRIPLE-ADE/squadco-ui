import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "@/services/api";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
  bvn: string;
  dob: string | null;
  address: string;
  gender: string;
  beneficiary_account: string | null;
  is_verified: boolean;
  transaction_pin: string | null;
  business_name: string | null;
  user_type: string;
};

type Wallet = {
  balance: number;
  virtual_account_number: string;
};

type SubWallet = {
  // Define properties if sub_wallet has a structure; otherwise, keep it as an empty array
};

type AuthState = {
  user: User;
  wallet?: Wallet;
  sub_wallet?: SubWallet[];
};


type AuthContextType = {
  user: AuthState | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<AuthState>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem("user");
      setUser(user ? JSON.parse(user) : null);

      console.log({user})
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("users/login/", { email, password });
      console.log(response.data);
      const { token, ...userInfo } = response.data;
      setUser(userInfo); 
      await AsyncStorage.setItem("user", JSON.stringify(userInfo));
      await AsyncStorage.setItem("token", token);
      if (!response.data.user.is_verified) {
        router.replace("/(stacks)/profile/setup");
      } else {
        router.replace("/(tabs)");
      }
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
         // New users need to verify profile
         wallet: {
          balance: 0,
          virtual_account_number: "1234567890",
        },
        sub_wallet: [],
        user: {
          id: 1,
          first_name: "Ade",
          last_name: "Ade",
          email,
          is_verified: false,
          phone: "08060000000",
          bvn: "1234567890",
          dob: "1990-01-01",
          address: "123 Main St",
          gender: "Male",
          beneficiary_account: "1234567890",
          transaction_pin: "123456",
          business_name: "Ade's Business",
          user_type: "individual",
        },
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
      await AsyncStorage.removeItem("token");
      setUser(null);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<AuthState>) => {
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
