import { resendClient, sender } from "../lib/resend.js";
import { ENV } from "../lib/env.js";

export const sendPasswordResetEmail = async (email, verificationCode) => {
  console.log("\n📧 ATTEMPTING TO SEND PASSWORD RESET EMAIL");
  console.log("----------------------------------------");
  console.log("To:", email);
  console.log("Template:", ENV.RESEND_PASSWORD_RESET_TEMPLATE_ID);
  console.log("From:", `${sender.name} <${sender.email}>`);
  console.log("API Key:", ENV.RESEND_API_KEY ? "✓ Present" : "✗ Missing");
  console.log("Verification Code:", verificationCode);
  
  try {
    const emailPayload = {
      from: `${sender.name} <${sender.email}>`,
      to: email,
      template: ENV.RESEND_PASSWORD_RESET_TEMPLATE_ID,
      variables: {
        verificationCode: verificationCode,
      },
    };

    console.log("\nPayload:", JSON.stringify(emailPayload, null, 2));

    const response = await resendClient.emails.send(emailPayload);
    
    console.log("\n✅ Resend Response:", JSON.stringify(response, null, 2));

    if (response.error) {
      console.error("❌ Resend Error:", response.error);
      throw new Error(`Resend error: ${JSON.stringify(response.error)}`);
    }

    if (response.data) {
      console.log("✅ Email sent successfully!");
      console.log("Email ID:", response.data.id);
    }

    return response;
  } catch (error) {
    console.error("\n❌ ERROR in sendPasswordResetEmail:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", JSON.stringify(error, null, 2));
    throw error;
  }
};
