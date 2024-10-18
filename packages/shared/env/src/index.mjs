import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Server-side environment schema
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  POOLING_DATABASE_URL: z.string().optional(),
  DATABASE_PASSWORD: z.string().optional(),
  API_SECRET: z.string().optional(),
  SUPABASE_URL: z.string().min(1, 'SUPABASE_URL is required'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET is required'),
  ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  AXIOM_TOKEN: z.string().optional(),
  AXIOM_ORG_ID: z.string().optional(),
  AXIOM_DATASET: z.string().optional(),
  LOG_LEVEL: z.string().optional(),
  API_URL: z.string().min(1, 'API_URL is required'),
  CLIENT_URL: z.string().min(1, 'CLIENT_URL is required'),
  DOMAIN: z.string().optional(),
});

// Client-side environment schema
const clientEnvSchema = z.object({
  VITE_ENV: z.enum(['development', 'production', 'staging']).default('development'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VITE_API_URL: z.string().min(1, 'VITE_API_URL is required'),
  VITE_CLIENT_URL: z.string().min(1, 'VITE_CLIENT_URL is required'),
});

// Parse and validate server environment
const serverEnv = serverEnvSchema.safeParse(process.env);

// Parse and validate client environment
const clientEnv = clientEnvSchema.safeParse(process.env);

// Check if both server and client environment validations were successful
if (!serverEnv.success || !clientEnv.success) {
  console.error('❌ Invalid environment variables:');
  if (!serverEnv.success) {
    console.error('Server environment errors:', serverEnv.error.format());
  }
  if (!clientEnv.success) {
    console.error('Client environment errors:', clientEnv.error.format());
  }
  process.exit(1);
}

// Server-only variables (sensitive)
export const SERVER_ENV = serverEnv.data;

// Client-safe variables
export const CLIENT_ENV = clientEnv.data;
