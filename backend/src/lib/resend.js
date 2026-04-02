import { Resend } from "resend";
import { ENV } from "./env.js";

console.log("\n🔧 RESEND CLIENT INITIALIZATION");
console.log("--------------------------------");
console.log("API Key:", ENV.RESEND_API_KEY ? "✓ Present" : "✗ MISSING");
console.log("Email From:", ENV.EMAIL_FROM);
console.log("Email From Name:", ENV.EMAIL_FROM_NAME);
console.log("Template ID:", ENV.RESEND_PASSWORD_RESET_TEMPLATE_ID);
console.log("--------------------------------\n");

export const resendClient = new Resend(ENV.RESEND_API_KEY);

export const sender = {
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};
