import React, { createContext, useContext, useState, useCallback } from "react";
import { googleLogout, type CredentialResponse } from "@react-oauth/google";
import { ApiLoginConnector, ApiLogoutConnector, ApiRefreshConnector } from "../components/ApiAuthConnectors";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import type { AuthUser, DecodedAccessToken } from "../types/global";

interface AuthContextType {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  handleLogin: (googleResponse: CredentialResponse) => Promise<void>;
  handleLogoutOK: () => Promise<void>;
  refreshAccessToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleLogin = async (googleResponse: CredentialResponse) => {
    try {
      const authResponse = await ApiLoginConnector({
        data: googleResponse,
      });
      const accessToken = authResponse?.data?.accessToken;
      const decodedAccessToken = jwtDecode<DecodedAccessToken>(accessToken);

      if (decodedAccessToken && decodedAccessToken.exp > Date.now()) {
        setAuthUser(decodedAccessToken?.user);
        setAccessToken(accessToken);
      }
    } catch {
      toast.warning(`Nemate ovlascenja za pristup aplikaciji`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleLogoutOK = async () => {
    try {
      await ApiLogoutConnector();
      googleLogout();
      setAuthUser(null);
      setAccessToken(null);
      toast.success(`Uspešno ste se odjavili`, {
        position: "top-center",
      });
    } catch (err) {
      toast.warning(`Ups! Došlo je do greške: ${err}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshTokenResponse = await ApiRefreshConnector();
      if (refreshTokenResponse) {
        const newAccessToken = refreshTokenResponse?.data?.accessToken;
        const decodedAccessToken = jwtDecode<DecodedAccessToken>(newAccessToken);
        setAuthUser(decodedAccessToken?.user);
        setAccessToken(newAccessToken);
        return newAccessToken;
      }
    } catch {
      toast.warning(`Ulogujte se kako biste pristupili aplikaciji`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return <AuthContext.Provider value={{ authUser, setAuthUser, accessToken, setAccessToken, handleLogin, handleLogoutOK, refreshAccessToken }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
