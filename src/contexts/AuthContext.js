import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const AUTH_URL = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(() => {
    try { return JSON.parse(localStorage.getItem('shop_user')) || null; }
    catch { return null; }
  });
  const [loginOpen, setLoginOpen] = useState(false);

  const saveUser = useCallback((userData, token) => {
    localStorage.setItem('shop_user', JSON.stringify(userData));
    localStorage.setItem('shop_token', token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('shop_user');
    localStorage.removeItem('shop_token');
    setUser(null);
  }, []);

  const loginPhone = useCallback(async (phone, password) => {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    saveUser(data.user, data.token);
    return data.user;
  }, [saveUser]);

  const registerPhone = useCallback(async (name, phone, password) => {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    saveUser(data.user, data.token);
    return data.user;
  }, [saveUser]);

  const loginGoogle = useCallback(async (credential) => {
    const res = await fetch(`${AUTH_URL}/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    saveUser(data.user, data.token);
    return data.user;
  }, [saveUser]);

  const loginFacebook = useCallback(async (accessToken, userID) => {
    const res = await fetch(`${AUTH_URL}/facebook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, userID }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    saveUser(data.user, data.token);
    return data.user;
  }, [saveUser]);

  return (
    <AuthContext.Provider value={{ user, loginOpen, setLoginOpen, logout, loginPhone, registerPhone, loginGoogle, loginFacebook, saveUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
