
function envVariables(): {
  GOOGLE_GENERATIVE_AI_API_KEY: string;
  GOOGLE_API_KEY: string;
  MONGODB_URI: string;
  CAL_USERNAME: string;
  CAL_EVENT_TYPE_SLUG: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  TOOL_APPROVAL_SECRET: string;
  CAL_API_KEY: string;
} {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is missing");
  }
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing");
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }
  if (!process.env.CAL_USERNAME) {
    throw new Error("CAL_USERNAME is missing");
  }
  if (!process.env.CAL_EVENT_TYPE_SLUG) {
    throw new Error("CAL_EVENT_TYPE_SLUG is missing");
  }
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    throw new Error("UPSTASH_REDIS_REST_URL is missing");
  }
  if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("UPSTASH_REDIS_REST_TOKEN is missing");
  }
  if (!process.env.TOOL_APPROVAL_SECRET) {
    throw new Error("TOOL_APPROVAL_SECRET is missing");
  }
  if (!process.env.CAL_API_KEY) {
    throw new Error("CAL_API_KEY is missing");
  }

  return {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    CAL_USERNAME: process.env.CAL_USERNAME,
    CAL_EVENT_TYPE_SLUG: process.env.CAL_EVENT_TYPE_SLUG,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    TOOL_APPROVAL_SECRET: process.env.TOOL_APPROVAL_SECRET,
    CAL_API_KEY: process.env.CAL_API_KEY,
  };
}

const getEnv = envVariables();
export default getEnv;