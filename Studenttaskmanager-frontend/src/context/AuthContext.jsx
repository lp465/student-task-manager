/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const stored = JSON.parse(localStorage.getItem("auth")) || null;
  const [auth, setAuth] = useState(stored);

  const login = (authData) => {
    // authData expected: { token, user }
    setAuth(authData);
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  const user = auth?.user || null;
  const token = auth?.token || null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
