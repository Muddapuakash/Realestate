import { createContext, useState, useEffect } from "react";
import { getToken, saveToken, removeToken } from "@/utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser({ token }); // Here, you may want to decode token & fetch user data
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    saveToken(token);
    setUser({ token });
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
