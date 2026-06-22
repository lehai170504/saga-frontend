"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor";
  avatarInitials: string;
  group?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "u001",
    name: "Lê Hoàng Hải",
    email: "haile@student.edu.vn",
    role: "student",
    avatarInitials: "LH",
    group: "Nhóm PBL-07",
    password: "123456",
  },
  {
    id: "u002",
    name: "Giảng viên Hướng dẫn",
    email: "instructor@university.edu",
    role: "instructor",
    avatarInitials: "GV",
    password: "admin",
  },
];

const TOKEN_KEY = "saga_auth_token";
const USER_KEY = "saga_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra phiên đăng nhập đã lưu trong localStorage
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Bỏ qua lỗi parse
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Giả lập API call (delay 600ms)
    await new Promise((res) => setTimeout(res, 600));

    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }

    const { password: _, ...userData } = found;
    const mockToken = `saga_token_${Date.now()}`;

    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng bên trong AuthProvider");
  return ctx;
}
