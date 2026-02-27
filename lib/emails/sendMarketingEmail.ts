// /lib/emails/sendMarketingEmail.ts
import transporter from "@/lib/nodemailer";

export async function sendMarketingEmail(to: string[], subject: string, content: string) {
    try {
        const mailOptions = {
            from: {
                name: "Maloof Health Systems",
                address: process.env.GMAIL_USER!,
            },
            bcc: to, // ✅ hides recipients from each other
            subject,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); margin: 20px auto;">
                        
                        <!-- Header with Healthcare Gradient -->
                        <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); padding: 40px 30px; text-align: center;">
                            <div style="display: inline-block; width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 32px;">🏥</span>
                            </div>
                            <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 10px; letter-spacing: -0.5px;">Maloof Health Systems</h1>
                            <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Your trusted healthcare partner</p>
                        </div>
                        
                        <!-- Main Content -->
                        <div style="padding: 40px 30px; background: #ffffff;">
                            <h2 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">${subject}</h2>
                            
                            <div style="background: #f0f9ff; border-radius: 16px; padding: 25px; margin: 25px 0; border: 1px solid #bae6fd;">
                                <p style="color: #0c4a6e; font-size: 16px; line-height: 1.6; margin: 0;">${content}</p>
                            </div>
                            
                            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 30px 0;">
                                <p style="color: #334155; font-size: 14px; margin: 0 0 10px; font-weight: 600;">Important Health Information:</p>
                                <ul style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>This communication contains important health information</li>
                                    <li>If you have urgent medical concerns, please contact our 24/7 nurse line</li>
                                    <li>Your privacy is protected under HIPAA regulations</li>
                                </ul>
                            </div>
                            
                            <!-- Security Badges -->
                            <div style="display: flex; justify-content: center; gap: 20px; margin: 30px 0;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></span>
                                    <span style="color: #64748b; font-size: 13px;">HIPAA Compliant</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="width: 8px; height: 8px; background: #2563eb; border-radius: 50%;"></span>
                                    <span style="color: #64748b; font-size: 13px;">Secure Communication</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 14px; margin: 0 0 15px;">
                                <strong>Maloof Health Systems</strong><br>
                                700 West Elm Street, Dallas, TX 75201
                            </p>
                            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 20px;">
                                📞 (214) 555-0423 | 📧 care@maloofhealth.com
                            </p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                This email was sent to you as a patient of Maloof Health Systems.<br>
                                © ${new Date().getFullYear()} Maloof Health Systems. All rights reserved.
                            </p>
                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px dashed #cbd5e1;">
                                <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                                    This is an automated message from your healthcare provider. Please do not reply to this email.<br>
                                    For medical emergencies, please call 911 immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </body>s
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Health campaign email sent to ${to.length} patients`);
        return { success: true };
    } catch (error) {
        console.error("❌ Error sending health campaign email:", error);
        throw error;
    }
}