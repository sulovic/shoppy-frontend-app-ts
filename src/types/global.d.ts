// Shared types

export type User = {
  ime_prezime: string;
  email: string;
  role_id: 1001 | 3001 | 5001;
  role: string;
};

export type AuthUser = {
  user: string;
  email: string;
  role_id: 1001 | 3001 | 5001;
  role: string;
  picture: string;
  superAdmin: boolean;
};

export type DecodedAccessToken = {
  exp: number;
  user: AuthUser;
};

export type LoginData = {};

export type AccessToken = string | null;

export type PrivilegesMap = Record<string, number>;
