import {
  UserDataSchema,
  AuthUserSchema,
  QueryParamsSchema,
  EnvSchema,
  ReklamacijaSchema,
  JwtPayloadSchema,
  JciPodaciSchema,
  JciProizvodiSchema,
  ProizvodiSchema,
  VrstaOtpadaSchema,
  OtpadProizvodSchema,
  JciProizvodiSchema,
  JciPodaciSchema,
} from "../schemas/schemas.js";

declare global {
  type AppLink = {
    label: string;
    image: string;
    desc: string;
    href: string;
    minRole: number;
  };

  type PaginationProps = {
    pagination: {
      page: number;
      limit: number;
      count: number;
    };
    setPagination: React.Dispatch<
      React.SetStateAction<{
        page: number;
        limit: number;
        count: number;
      }>
    >;
  };
  type QueryParams = z.infer<typeof QueryParamsSchema>;
  type Env = z.infer<typeof EnvSchema>;
  type UserData = z.infer<typeof UserDataSchema>;
  type AuthUser = z.infer<typeof AuthUserSchema>;
  type JWTPayload = z.infer<typeof JwtPayloadSchema>;
  type Reklamacija = z.infer<typeof ReklamacijaSchema>;
  type JciPodaci = z.infer<typeof JciPodaciSchema>;
  type JciProizvodi = z.infer<typeof JciProizvodiSchema>;
  type OtpadProizvod = z.infer<typeof OtpadProizvodSchema>;
  type VrstaOtpada = z.infer<typeof VrstaOtpadaSchema>;
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export {};
