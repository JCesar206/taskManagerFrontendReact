import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authApi from '../api/auth.js';
import { getToken, setToken, clearToken, setUnauthorizedHandler } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  // Al cargar la página: si hay token guardado, recupera el usuario
  useEffect(() => {
    setUnauthorizedHandler(logout)
    if (!getToken()) {
      setLoading(false);
      return
    }
    authApi
      .getMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [logout]);

  const login = async (email, password) => {
    const { access_token } = await authApi.login(email, password)
    setToken(access_token);
    setUser(await authApi.getMe());
  }

  const register = async (email, password) => {
    await authApi.register(email, password);
    await login(email, password);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);