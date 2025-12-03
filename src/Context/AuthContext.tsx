import React, { createContext, useState } from "react";
import { ApiGoogleLoginConnector, ApiLogoutConnector, ApiRefreshConnector } from "../components/ApiAuthConnectors";
import type { CodeResponse } from "@react-oauth/google";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { authUserSchema } from "../../../../RetailStore/retail-store-app-backend/types/types";

interface AuthContextType {
  authUser: AuthUser | null;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  handleGoogleLogin: (googleCode: CodeResponse) => Promise<void>;
  handleLogoutOK: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const processAccessToken = (accessToken: string) => {
    const decodedAccessToken: JWTPayload = jwtDecode(accessToken);

    if (decodedAccessToken && decodedAccessToken.exp > Date.now()) {
      const authUserData = authUserSchema.parse({ ...decodedAccessToken, superAdmin: false });
      setAuthUser(authUserData);
      setAccessToken(accessToken);
    }
  };

  const handleGoogleLogin = async (googleCode: CodeResponse) => {
    try {
      const receivedAccessToken = await ApiGoogleLoginConnector(googleCode);
      processAccessToken(receivedAccessToken);
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

  const refreshAccessToken: () => Promise<string | null> = async () => {
    try {
      const newAccessToken = await ApiRefreshConnector();
      if (!newAccessToken) {
        throw new Error("Failed to refresh access token");
      }
       processAccessToken(newAccessToken);
      return newAccessToken;
    } catch {
      toast.warning(`Ulogujte se kako biste pristupili aplikaciji`, {
        position: "top-center",
        autoClose: 3000,
      });
      return null;
    }
  };

  return <AuthContext.Provider value={{ authUser, setAuthUser, accessToken, setAccessToken, handleGoogleLogin, handleLogoutOK, refreshAccessToken }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
