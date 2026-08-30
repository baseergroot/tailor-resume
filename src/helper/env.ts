
function envVariables(): {
  GOOGLE_GENERATIVE_AI_API_KEY: string;
  MONGODB_URI: string;
} {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is missing");
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  return {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
  };
}

const getEnv = envVariables();
export default getEnv;