import { z } from "zod";

export const envSchema = z.object({
    DATABASE_HOST: z.string().min(1, "DATABASE_HOST is required"),
    DATABASE_PORT: z.coerce.number().default(5432),
    DATABASE_USER: z.string().min(1, "DATABASE_USER is required"),
    DATABASE_PASSWORD: z.string().min(1, "DATABASE_PASSWORD is required"),
    DATABASE_DB: z.string().min(1, "DATABASE_DB is required"),
    API_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export type Env = z.infer<typeof envSchema>;
