import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthCtx = createContext(null);

function parseJwt(t){ try{ return JSON.parse(atob(t.split(".")[1])); }catch{return null;} }
function isTokenExpired(t){
  if (!t || !t.includes(".")) return true;
  const p = parseJwt(t);
  return !p?.exp || (Date.now()/1000 >= p.exp);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t || isTokenExpired(t)) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      return null;
    }
    return t;
  });

  const [refresh, setRefresh] = useState(() => localStorage.getItem("refresh"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });

  const login = useCallback(({ token, refresh, user }) => {
    setUser(user);
    setToken(token);
    if (refresh) setRefresh(refresh);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    if (refresh) localStorage.setItem("refresh", refresh);
  }, []);

  const logout = useCallback(() => {
    setUser(null); setToken(null); setRefresh(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  }, []);

  const isAuthed = !!token && !isTokenExpired(token);

  const value = useMemo(
    () => ({ user, token, refresh, login, logout, isAuthed }),
    [user, token, refresh, login, logout, isAuthed]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(){
  const ctx = useContext(AuthCtx);
  if(!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function Protected({ children, fallback }){
  const { isAuthed } = useAuth();
  const location = useLocation();
  if (!isAuthed) {
    return fallback ?? <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
