
function envVariables(): {
  GOOGLE_GENERATIVE_AI_API_KEY: string;
  MONGODB_URI: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  CLERK_WEBHOOK_SECRET:string;
} {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is missing");
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing");
  }
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is missing");
  }
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET is missing");
  }

  return {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
  };
}

const getEnv = envVariables();
export default getEnv;