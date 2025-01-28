import { z } from "zod";

const envSchema = z.object({
    DATABASE_HOST: z.string().min(1, "DATABASE_HOST is required"),
    DATABASE_PORT: z.coerce.number().default(5432),
    DATABASE_USER: z.string().min(1, "DATABASE_USER is required"),
    DATABASE_PASSWORD: z.string().min(1, "DATABASE_PASSWORD is required"),
    DATABASE_NAME: z.string().min(1, "DATABASE_NAME is required"),
    API_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export const validateEnv = (config: Record<string, unknown>) => {
    const parsed = envSchema.safeParse(config);

    if (!parsed.success) {
        throw new Error(
            `Invalid environment variables: ${parsed.error.errors
                .map((err) => `${err.path.join(".")} - ${err.message}`)
                .join(", ")}`,
        );
    }

    return parsed.data;
};

export type EnvConfig = z.infer<typeof envSchema>;
