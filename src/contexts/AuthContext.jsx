// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const { data: users } = await axios.get("http://localhost:5000/users");
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) throw new Error("Sai email hoặc mật khẩu!");

      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return foundUser;
    } catch (error) {
      throw error;
    }
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Cập nhật thông tin user
  const updateUser = async (updatedUser) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/users/${updatedUser.id}`,
        updatedUser
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Cập nhật thông tin thất bại:", error);
      throw error;
    }
  };

  // Đổi mật khẩu
  const updatePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error("Không tìm thấy người dùng.");

    // Kiểm tra mật khẩu hiện tại
    if (user.password !== currentPassword) {
      throw new Error("Mật khẩu hiện tại không đúng.");
    }

    const updatedUser = { ...user, password: newPassword };

    try {
      const res = await axios.put(
        `http://localhost:5000/users/${user.id}`,
        updatedUser
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Đổi mật khẩu thất bại:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
