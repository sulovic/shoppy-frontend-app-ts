// Shared types

declare type User = {
  ime_prezime: string;
  email: string;
  role_id: 1001 | 3001 | 5001;
  role: string;
};

declare type AuthUser = {
  user: string;
  email: string;
  role_id: 1001 | 3001 | 5001;
  role: string;
  picture: string;
  superAdmin: boolean;
};

declare type DecodedAccessToken = {
  exp: number;
  user: AuthUser;
};

declare type AppLink = {
  label: string;
  image: string;
  desc: string;
  href: string;
  minRole: number;
};

declare type AccessToken = string | null;

declare type PrivilegesMap = Record<string, number>;
