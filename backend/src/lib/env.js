import "dotenv/config";

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ARCJET_KEY",
];

export const ENV = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "Chugli",
  RESEND_PASSWORD_RESET_TEMPLATE_ID: process.env.RESEND_PASSWORD_RESET_TEMPLATE_ID,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  ARCJET_KEY: process.env.ARCJET_KEY,
  ARCJET_ENV: process.env.ARCJET_ENV || "development",
  LOG_MAJOR: process.env.LOG_MAJOR === "true",
  LOG_MINOR: process.env.LOG_MINOR === "true",
};

// Simple validation
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.warn(`\x1b[33m[WARNING] Environment variable ${key} is missing!\x1b[0m`);
  }
}

