// global.d.ts
import { z } from "zod";
import {
  QueryParamsSchema,
  FiltersOptionsSchema,
  EnvSchema,
  UserDataSchema,
  AuthUserSchema,
  JwtPayloadSchema,
  ReklamacijaSchema,
  JciPodaciSchema,
  JciProizvodiSchema,
  ProizvodiSchema,
  VrstaOtpadaSchema,
  OtpadProizvodSchema,
  NabavkeProizvodSchema,
  NabavkeSadrzajSchema,
  PorudzbinaSchema,
} from "../schemas/schemas";

declare global {
  type AuthUser = z.infer<typeof AuthUserSchema>;
  type UserData = z.infer<typeof UserDataSchema>;
  type QueryParams = z.infer<typeof QueryParamsSchema>;
  type FiltersOptions = z.infer<typeof FiltersOptionsSchema>;
  type Env = z.infer<typeof EnvSchema>;
  type JWTPayload = z.infer<typeof JwtPayloadSchema>;
  type Reklamacija = z.infer<typeof ReklamacijaSchema>;
  type JciPodaci = z.infer<typeof JciPodaciSchema>;
  type JciProizvodi = z.infer<typeof JciProizvodiSchema>;
  type Proizvodi = z.infer<typeof ProizvodiSchema>;
  type VrstaOtpada = z.infer<typeof VrstaOtpadaSchema>;
  type OtpadProizvod = z.infer<typeof OtpadProizvodSchema>;
  type NabavkeProizvod = z.infer<typeof NabavkeProizvodSchema>;
  type NabavkeSadrzaj = z.infer<typeof NabavkeSadrzajSchema>;
  type Porudzbina = z.infer<typeof PorudzbinaSchema>;

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

  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends Env {}
  }
}

export {};
