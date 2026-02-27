// /lib/emails/sendReservationEmail.ts
import transporter from "@/lib/nodemailer";

type AppointmentStatus = "approved" | "cancelled";

export async function sendAppointmentEmail(
  to: string,
  name: string,
  status: AppointmentStatus
): Promise<{ error?: string }> {
  const subject =
    status === "approved"
      ? "✅ Your Appointment Has Been Confirmed - Maloof Health"
      : "❌ Your Appointment Has Been Cancelled - Maloof Health";

  const title =
    status === "approved"
      ? "Appointment Confirmed ✅"
      : "Appointment Cancelled ❌";

  const message =
    status === "approved"
      ? `We're pleased to inform you that your appointment with <b>Maloof Health Systems</b> has been confirmed. Our medical team looks forward to providing you with exceptional care.`
      : `We regret to inform you that your appointment at <b>Maloof Health Systems</b> has been cancelled. Please contact us to reschedule at your earliest convenience.`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
        <div style="max-width: 560px; margin: 20px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
            
            <!-- Header with Medical Theme -->
            <div style="background: linear-gradient(135deg, ${status === "approved" ? '#059669, #10b981' : '#dc2626, #ef4444'}); padding: 40px 30px; text-align: center;">
                <div style="display: inline-block; width: 72px; height: 72px; background: rgba(255,255,255,0.15); border-radius: 50%; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 36px;">${status === "approved" ? '✅' : '❌'}</span>
                </div>
                <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 10px; letter-spacing: -0.5px;">Maloof Health Systems</h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Patient Appointment Notification</p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px; background: #ffffff;">
                <h2 style="color: #1e293b; font-size: 28px; font-weight: 600; margin: 0 0 25px; text-align: center;">${title}</h2>
                
                <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                    Dear <strong style="color: ${status === "approved" ? '#059669' : '#dc2626'};">${name}</strong>,
                </p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">${message}</p>

                ${status === "approved" ? `
                    <!-- Confirmed Appointment Details Placeholder -->
                    <div style="background: #f0f9ff; border-radius: 16px; padding: 25px; margin: 25px 0; border: 1px solid #bae6fd;">
                        <h3 style="color: #0369a1; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Appointment Details</h3>
                        <p style="color: #475569; font-size: 14px; margin: 0;">Your appointment details will appear in your patient portal.</p>
                    </div>

                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://maloofhealth.vercel.app/dashboard"
                           style="background: linear-gradient(135deg, #2563eb, #06b6d4); 
                                  color: #ffffff; 
                                  text-decoration: none; 
                                  padding: 14px 32px; 
                                  border-radius: 50px; 
                                  font-weight: 600; 
                                  font-size: 16px;
                                  display: inline-block;
                                  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);">
                            View in Patient Portal
                        </a>
                    </div>
                ` : `
                    <!-- Cancellation Information -->
                    <div style="background: #fef2f2; border-radius: 16px; padding: 25px; margin: 25px 0; border: 1px solid #fecaca;">
                        <h3 style="color: #991b1b; font-size: 18px; font-weight: 600; margin: 0 0 15px;">Need to Reschedule?</h3>
                        <p style="color: #7f1d1d; font-size: 14px; margin: 0;">
                            Please contact our scheduling team at (214) 555-0424 or visit our patient portal to book a new appointment.
                        </p>
                    </div>
                `}

                <!-- Important Medical Information -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 25px 0;">
                    <p style="color: #475569; font-size: 14px; font-weight: 600; margin: 0 0 10px;">📋 Important Reminders:</p>
                    <ul style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 20px;">
                        <li>Please arrive 15 minutes before your scheduled time</li>
                        <li>Bring your insurance card and photo ID</li>
                        <li>Download the patient portal for easy check-in</li>
                    </ul>
                </div>
            </div>

            <!-- Footer with Medical Contact Info -->
            <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #334155; font-size: 15px; font-weight: 600; margin: 0 0 10px;">Maloof Health Systems</p>
                <p style="color: #64748b; font-size: 14px; margin: 0 0 5px;">700 West Elm Street, Dallas, TX 75201</p>
                <p style="color: #64748b; font-size: 14px; margin: 0 0 20px;">
                    📞 Appointments: (214) 555-0424 | 🚑 Emergency: (214) 555-0911
                </p>
                
                <!-- Emergency Notice -->
                <div style="background: #fee2e2; border-radius: 8px; padding: 12px; margin: 20px 0;">
                    <p style="color: #991b1b; font-size: 13px; margin: 0;">
                        <strong>⚠️ For medical emergencies, please call 911 immediately.</strong>
                    </p>
                </div>

                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    This is an automated message from your healthcare provider.<br>
                    Protected health information - Confidential
                </p>
                
                <div style="margin-top: 20px; display: flex; justify-content: center; gap: 16px;">
                    <span style="color: #94a3b8; font-size: 11px;">HIPAA Compliant</span>
                    <span style="color: #94a3b8; font-size: 11px;">•</span>
                    <span style="color: #94a3b8; font-size: 11px;">256-bit Encrypted</span>
                    <span style="color: #94a3b8; font-size: 11px;">•</span>
                    <span style="color: #94a3b8; font-size: 11px;">Secure Portal</span>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const mailOptions = {
      from: {
        name: "Maloof Health Systems",
        address: process.env.GMAIL_USER!,
      },
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Appointment email sent to ${to}`);
    return {};
  } catch (error: any) {
    console.error("💥 Error sending appointment email:", error);
    return { error: error.message || "Unexpected error" };
  }
}