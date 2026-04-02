import { Resend } from "resend";
import { ENV } from "./env.js";

const resend = new Resend(ENV.RESEND_API_KEY);

export const setupPasswordResetTemplate = async () => {
  try {
    console.log("🔧 Setting up Resend password reset template...");

    const template = await resend.templates.create({
      name: "password-reset",
      from: ENV.EMAIL_FROM,
      subject: "Reset Your Chugli Password",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
  </head>
  <body style="font-family: 'Space Grotesk', Arial, sans-serif; background-color: #f5f0e8; padding: 40px 20px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: white; border: 3px solid #1a1a1a; padding: 40px;">
      <!-- Header -->
      <div style="background: linear-gradient(to right, #e63b2e, #ff6b6b); padding: 30px; margin: -40px -40px 30px -40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900;">PASSWORD RESET</h1>
      </div>
      
      <!-- Body -->
      <p style="color: #1a1a1a; font-size: 14px; margin-bottom: 20px;">
        A password reset request was submitted for your Chugli account. Use the verification code below to reset your password.
      </p>
      
      <!-- Code Box -->
      <div style="text-align: center; background-color: #f5f0e8; border: 2px solid #1a1a1a; padding: 30px; margin: 30px 0;">
        <p style="color: #1a1a1a; font-size: 12px; font-weight: 900; margin-bottom: 10px; letter-spacing: 0.1em; text-transform: uppercase;">Verification Code</p>
        <p style="color: #1a1a1a; font-size: 48px; font-weight: 900; margin: 0; font-family: 'Courier New', monospace; letter-spacing: 0.2em;">{{verificationCode}}</p>
      </div>
      
      <p style="color: #1a1a1a; font-size: 12px; opacity: 0.7; margin: 20px 0;">
        This code expires in <strong>10 minutes</strong>. If you didn't request a password reset, ignore this email.
      </p>
      
      <!-- Warning Box -->
      <div style="background-color: #fff5f5; border-left: 4px solid #e63b2e; padding: 15px; margin: 20px 0;">
        <p style="color: #e63b2e; font-size: 12px; margin: 0; font-weight: 600;">⚠️ Security Notice: Chugli will never ask you for this code via email. If you didn't request this, your account may be at risk.</p>
      </div>
      
      <p style="color: #1a1a1a; font-size: 11px; text-align: center; margin-top: 30px; opacity: 0.6;">
        Chugli • Premium Messaging Platform
      </p>
    </div>
  </body>
</html>`,
      variables: [
        {
          key: "verificationCode",
          type: "string",
          fallbackValue: "000000",
        },
      ],
    });

    await template.publish();

    console.log("✅ Password reset template created successfully!");
    console.log(`📋 Template ID: ${template.id}`);
    console.log(`\nAdd this to your .env file:`);
    console.log(`RESEND_PASSWORD_RESET_TEMPLATE_ID=${template.id}`);

    return template.id;
  } catch (error) {
    console.error("❌ Error creating template:", error);
    throw error;
  }
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupPasswordResetTemplate().catch(console.error);
}
