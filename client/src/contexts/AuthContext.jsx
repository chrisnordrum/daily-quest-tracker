import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const register = async (username, password, firstName, lastName, email) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error creating user");
    }

    setUser(data.user);
  };

  const login = async (username, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error signing in");
    }

    setUser(data.user);
  };

  const logout = () => {
    setUser(null);
  }

  const values = {
    user,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "Context Error: useAuth must be used within the Auth Provider",
    );
  }
  return context;
};
