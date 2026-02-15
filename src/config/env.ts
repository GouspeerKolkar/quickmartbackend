import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

/**
 * Environment states
 */
export enum EnvState {
  PROD = "production",
  DEV = "development",
  STAGE = "staging",
}

/**
 * Detect NODE_ENV safely
 */
export const NODE_ENV: EnvState | "test" =
  (process.env.NODE_ENV as EnvState | "test") ?? EnvState.DEV;

/**
 * Environment helpers
 */
export const isProduction = () => NODE_ENV === EnvState.PROD;
export const isDevelopment = () => NODE_ENV === EnvState.DEV;
export const isLocal = () => !isProduction() && !isDevelopment();

let _resolvedPath: string | null | undefined;

/**
 * Detect correct .env file
 */
export function getEnvFileName(): string | null {
  if (_resolvedPath !== undefined) return _resolvedPath;

  const candidate = `.env.${NODE_ENV || "development"}`;
  const fullPath = path.resolve(process.cwd(), candidate);

  _resolvedPath = fs.existsSync(fullPath) ? candidate : null;
  return _resolvedPath;
}

/**
 * Load dotenv once
 */
export function loadDotenv(): string | null {
  const envFile = getEnvFileName();

  if (envFile) {
    dotenv.config({ path: envFile });
  } else {
    dotenv.config(); // fallback to plain .env
  }

  return envFile;
}

/**
 * 🔥 Load immediately on import (IMPORTANT)
 */
loadDotenv();

/**
 * ⭐ Safe dynamic env getter (NO NEED to edit file for new vars)
 */
export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;

  if (value === undefined) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value;
}
