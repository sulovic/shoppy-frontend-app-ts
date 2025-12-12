import React, { createContext, useState } from "react";
import { ApiGoogleLoginConnector, ApiLogoutConnector, ApiRefreshConnector, ApiPasswordLoginConnector } from "../services/apiAuthConnectors";
import type { CodeResponse } from "@react-oauth/google";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { AuthUserSchema } from "../schemas/schemas";
import { handleApiError } from "../services/errorHandler";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  authUser: AuthUser | null;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  handleGoogleLogin: (googleCode: CodeResponse) => Promise<void>;
  handleLogoutOK: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  handlePasswordLogin: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const processAccessToken = (accessToken: string) => {
    try {
      const decodedAccessToken: JWTPayload = jwtDecode(accessToken);

      if (decodedAccessToken && decodedAccessToken.exp > Math.floor(Date.now() / 1000)) {
        const authUserData = AuthUserSchema.parse({ ...decodedAccessToken, superAdmin: false });
        setAuthUser(authUserData);
        setAccessToken(accessToken);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handlePasswordLogin = async (email: string, password: string) => {
    try {
      const receivedAccessToken = await ApiPasswordLoginConnector(email, password);
      processAccessToken(receivedAccessToken);
      navigate("/");
    } catch (error) {
      //error already processed
    }
  };

  const handleGoogleLogin = async (googleCode: CodeResponse) => {
    try {
      const receivedAccessToken = await ApiGoogleLoginConnector(googleCode);
      processAccessToken(receivedAccessToken);
      navigate("/");
    } catch (error) {
      //error already processed
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
      navigate("/login");
    } catch {
      //error already processed
    }
  };

  const refreshAccessToken: () => Promise<void> = async () => {
    try {
      const newAccessToken = await ApiRefreshConnector();
      processAccessToken(newAccessToken);
    } catch (error) {
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return <AuthContext.Provider value={{ authUser, setAuthUser, accessToken, setAccessToken, handleGoogleLogin, handleLogoutOK, refreshAccessToken, handlePasswordLogin }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
