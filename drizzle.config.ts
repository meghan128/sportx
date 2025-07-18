import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Environment validation
const requiredEnvVars = ["DATABASE_URL"] as const;
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}. 
    Please ensure your .env file is properly configured and the database is provisioned.`
  );
}

// Environment-specific configuration
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  // Schema and migration paths
  out: "./migrations",
  schema: "./shared/schema.ts",

  // Database configuration
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // SSL configuration for production
    ssl: isProduction ? { rejectUnauthorized: false } : undefined,
  },

  // Enhanced migration settings
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },

  // Development optimizations
  verbose: isDevelopment,
  strict: true,

  // Enhanced introspection settings
  introspect: {
    casing: "camelCase",
  },

  // Schema filters (useful for multi-tenant or large databases)
  schemaFilter: ["public"],

  // Table filters (exclude system tables, logs, etc.)
  tablesFilter: ["!drizzle_*", "!pg_*", "!information_schema*"],

  // Breakpoints for easier debugging
  breakpoints: isDevelopment,

  // Custom configuration for different environments
  ...(isDevelopment && {
    // Development-specific settings
    extensionsFilters: ["postgis"],
  }),

  ...(isProduction && {
    // Production-specific settings
    // Add any production-specific configurations here
  }),
});